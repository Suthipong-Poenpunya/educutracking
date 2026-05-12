import Foundation
import PDFKit

let args = CommandLine.arguments
if args.count < 2 {
    print("Usage: swift extract_pdf.swift <pdf_path>")
    exit(1)
}
let path = args[1]
let url = URL(fileURLWithPath: path)
guard let pdf = PDFDocument(url: url) else {
    print("Could not load PDF")
    exit(1)
}

if let text = pdf.string {
    print(text)
} else {
    print("No text found")
}
