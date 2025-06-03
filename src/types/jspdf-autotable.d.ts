import 'jspdf';

declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable: {
            finalY: number;
            startPageNumber: number;
            pageNumber: number;
        };
    }
}