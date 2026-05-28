import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import * as ExcelJS from "exceljs";
import { Request, Response } from "express";
import { format as formatCsv } from "fast-csv";
import moment from "moment";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

enum DownloadFormat {
  CSV = "csv",
  EXCEL = "excel",
}

enum FileType {
  JPG = "jpg",
  JPEG = "jpeg",
  PNG = "png",
  PDF = "pdf",
  XLSX = "xlsx",
  XLS = "xls",
  DOC = "doc",
  MP4 = "mp4",
  DOCX = "docx",
  PPT = "ppt",
  PPTX = "pptx",
  CSV = "csv",
}

@Injectable()
export class FileExportInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // if (!req.body.format || !req.body.fileName) {
    //   throw new BadRequestException("Missing request body for export format.");
    // }

    const format = (
      (req.body?.format || req.query?.format) as DownloadFormat
    )?.toLowerCase();
    const fileName =
      ((req.body?.fileName || req.query?.fileName) as string) || `asb_export`;
    console.log("FileExportInterceptor format:", format);
    const dateFormat = moment().format("YYYYMMDD_HHmmss");
    const fileFullName = `${fileName}_${dateFormat}.${format === DownloadFormat.EXCEL ? FileType.XLSX : FileType.CSV}`;

    try {
      if (
        ![DownloadFormat.EXCEL, DownloadFormat.CSV].includes(
          format as DownloadFormat,
        )
      ) {
        return next.handle();
      }

      return next.handle().pipe(
        mergeMap(async (data: any[]) => {
          if (format) {
            const formattedData = Array.isArray(data) ? data : [data];
            // download the file in excel format
            if (format === DownloadFormat.EXCEL) {
              const workbook = new ExcelJS.Workbook();
              const worksheet = workbook.addWorksheet("Sheet1");

              // Handle empty data case
              if (!formattedData || formattedData.length === 0) {
                // Add empty row with message
                const emptyRow = { Message: "No data available" };
                worksheet.addRow(Object.keys(emptyRow));
                worksheet.addRow(Object.values(emptyRow));
              } else if (fileName === "Survey_Response_Error") {
                // Define columns explicitly for error reports
                worksheet.columns = [
                  { header: "Type", key: "type", width: 15 },
                  { header: "Message", key: "message", width: 50 },
                ];

                formattedData.forEach((item) => {
                  worksheet.addRow({
                    type: String(item.type || ""),
                    message: String(item.message || ""),
                  });
                });
              } else {
                // Handle regular data export
                const firstItem =
                  (formattedData[0] as Record<string, any>) || {};
                const keys = Object.keys(firstItem);
                if (keys.length > 0) {
                  // Define columns with proper types
                  worksheet.columns = keys.map((key) => ({
                    header: key,
                    key: key,
                    width: 20,
                  }));

                  formattedData.forEach((item) => {
                    const row = {};
                    keys.forEach((key) => {
                      // Ensure all values are properly typed
                      const value = item[key];
                      if (value === null || value === undefined) {
                        row[key] = "";
                      } else if (typeof value === "object") {
                        row[key] = JSON.stringify(value);
                      } else {
                        row[key] = String(value);
                      }
                    });
                    worksheet.addRow(row);
                  });
                }
              }

              // Set proper headers
              res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              );
              res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileFullName}"`,
              );
              res.setHeader("Cache-Control", "no-cache");
              res.setHeader("Pragma", "no-cache");

              // Write directly to response stream and end
              await workbook.xlsx.write(res);
              res.end();
              return null;
            } else if (format === DownloadFormat.CSV) {
              res.setHeader("Content-Type", "text/csv");
              res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileFullName}"`,
              );

              const csvStream = formatCsv({ headers: true });
              csvStream.pipe(res);
              if (fileName == "Survey_Response_Error") {
                formattedData.forEach((item) => {
                  csvStream.write({
                    type: item.type,
                    message: item.message,
                  });
                });
              } else {
                formattedData.forEach((item) => csvStream.write(item));
              }
              csvStream.end();
              return null;
            }
          }
          return data;
        }),
      );
    } catch (err) {
      throw new BadRequestException({
        errors: err,
      });
    }
  }
}
