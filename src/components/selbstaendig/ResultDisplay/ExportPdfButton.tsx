import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import styles from './ExportPdfButton.module.css';
import { ThemeContext } from '../../../context/ThemeContext';
import { round } from '../../../utils';
import { autoTable } from 'jspdf-autotable';
import type { ExportPdfButtonProps } from '../../../types/components/selbstaendig/resultDisplay/exportPdfButton';
import { DownloadIcon } from '../../ui/icons';
import { notoSansRegularBase64 } from '../../../fonts/NotoSans-Regular-normal';
import { notoSansBoldBase64 } from '../../../fonts/NotoSans-Bold-normal';
import type { SocialContributionItem } from '../../../types/components/selbstaendig/socialContributions/socialContributions';


const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
    results,
    brutto,
    isMarried = false,
    spouseIncome = 0,
    socialContributions,
    taxDeductions,
    taxSavings
}) => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);


    const handleExport = async () => {
        try {
            const pdf = new jsPDF();

            // add font with Cyrillic support
            pdf.addFileToVFS('NotoSans-Regular-normal.ttf', notoSansRegularBase64);
            pdf.addFileToVFS('NotoSans-Bold-normal.ttf', notoSansBoldBase64);

            pdf.addFont('NotoSans-Regular-normal.ttf', 'NotoSans', 'normal');
            pdf.addFont('NotoSans-Bold-normal.ttf', 'NotoSans', 'bold');

            pdf.setFont('NotoSans');

            const currentFont = 'NotoSans';

            let y = 20;
            const margin = 20;
            const pageWidth = pdf.internal.pageSize.width;

            const addTitle = (text: string) => {
                pdf.setFontSize(18);
                pdf.setTextColor(0, 0, 0);
                pdf.text(text, pageWidth / 2, y, { align: 'center' });
                y += 10;
            };

            const addSubtitle = (text: string) => {
                pdf.setFontSize(14);
                pdf.setTextColor(60, 60, 60);
                pdf.text(text, margin, y);
                y += 7;
            };

            const addSectionTitle = (text: string) => {
                pdf.setFontSize(12);
                pdf.setTextColor(80, 80, 80);

                pdf.setFont(currentFont, 'bold');
                pdf.text(text, margin, y);
                pdf.setFont(currentFont, 'normal');
                y += 6;
            };

            const addTwoColumnRow = (label: string, value: string) => {
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                pdf.text(label, margin, y);
                pdf.text(value, pageWidth - margin, y, { align: 'right' });
                y += 5;
            };

            const addDivider = () => {
                pdf.setDrawColor(200, 200, 200);
                pdf.line(margin, y, pageWidth - margin, y);
                y += 5;
            };

            const checkPageBreak = (neededSpace: number) => {
                if (y + neededSpace > pdf.internal.pageSize.height - 10) {
                    pdf.addPage();
                    y = 20;
                }
            };

            // header
            addTitle(t('Steuerberechnung'));
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(new Date().toLocaleDateString(), pageWidth / 2, y, { align: 'center' });
            y += 15;

            // basic info
            addSectionTitle(t('Grundinformationen'));
            addTwoColumnRow(t('Bruttoeinkommen (monatlich):'), `${round(brutto)} €`);
            if (isMarried) {
                addTwoColumnRow(t('Familienstand:'), t('Verheiratet'));
                addTwoColumnRow(t('Ehepartner Bruttoeinkommen (monatlich):'), `${round(spouseIncome)} €`);
            } else {
                addTwoColumnRow(t('Familienstand:'), t('Ledig'));
            }
            y += 5;

            // results
            checkPageBreak(40);
            addSectionTitle(t('Ergebnis'));
            addTwoColumnRow(t('Nettoeinkommen (monatlich):'), `${round(results.netto)} €`);
            addTwoColumnRow(t('Steuer (monatlich):'), `${round(results.steuer)} €`);
            addTwoColumnRow(t('Sozialabgaben (monatlich):'), `${round(brutto - results.afterSocialContributions)} €`);

            // add VAT information if the user is a VAT payer
            if (results.isVatPayer) {
                const vatMonthly = round(results.vatToPay / 12);
                const vatYearly = round(results.vatToPay);

                checkPageBreak(30);
                y += 5;

                addSectionTitle(t('Umsatzsteuer'));
                addTwoColumnRow(t('Umsatzsteuersatz:'), `${results.vatPercent}%`);

                if (vatYearly > 0) {
                    addTwoColumnRow(t('Zu zahlende USt (monatlich):'), `${vatMonthly} €`);
                    addTwoColumnRow(t('Zu zahlende USt (jährlich):'), `${vatYearly} €`);
                } else if (vatYearly < 0) {
                    addTwoColumnRow(t('USt-Erstattung (monatlich):'), `${Math.abs(vatMonthly)} €`);
                    addTwoColumnRow(t('USt-Erstattung (jährlich):'), `${Math.abs(vatYearly)} €`);
                } else {
                    addTwoColumnRow(t('Umsatzsteuer-Position:'), t('Ausgeglichen'));
                }

                y += 5;
            }

            const percentLoss = ((brutto - results.netto) / brutto) * 100;
            addTwoColumnRow(t('Abzugsquote:'), `${round(percentLoss)}%`);
            y += 5;

            // ehegattensplitting
            if (isMarried && taxSavings) {
                checkPageBreak(30);
                addSectionTitle(t('Ehegattensplitting Vorteil'));
                addTwoColumnRow(t('Steuer ohne Splitting:'), `${taxSavings.individualTax} €`);
                addTwoColumnRow(t('Steuer mit Splitting:'), `${taxSavings.splittingTax} €`);
                addTwoColumnRow(t('Steuerersparnis:'), `${taxSavings.savings} €`);
                y += 5;
            }

            addDivider();

            // social contributions
            checkPageBreak(50);
            addSubtitle(t('Sozialversicherungsbeiträge'));

            // mandatory contributions
            if (socialContributions.mandatory) {
                const mandatoryItems = Object.values(socialContributions.mandatory);
                if (mandatoryItems.length > 0) {
                    y += 2;
                    addSectionTitle(t('Pflichtbeiträge'));

                    const mandatoryTable = [];
                    for (const item of mandatoryItems as SocialContributionItem[]) {
                        if (item.checked) {
                            mandatoryTable.push([t(item.label), `${round(item.amount)} €`]);
                        }
                    }

                    if (mandatoryTable.length > 0) {
                        autoTable(pdf, {
                            startY: y,
                            head: [[t('Bezeichnung'), t('Betrag')]],
                            body: mandatoryTable,
                            theme: 'grid',
                            headStyles: { fillColor: [100, 100, 100] },
                            margin: { left: margin, right: margin },
                            styles: { font: currentFont }
                        });

                        // update y position after table
                        y = pdf.lastAutoTable.finalY + 10;
                    } else {
                        addTwoColumnRow(t('Keine Pflichtbeiträge ausgewählt'), '');
                        y += 5;
                    }
                }
            }

            // voluntary contributions
            checkPageBreak(50);
            if (socialContributions.voluntary) {
                const voluntaryItems = Object.values(socialContributions.voluntary);
                if (voluntaryItems.length > 0) {
                    addSectionTitle(t('Freiwillige Beiträge'));

                    const voluntaryTable = [];
                    for (const item of voluntaryItems as SocialContributionItem[]) {
                        if (item.checked) {
                            voluntaryTable.push([t(item.label), `${round(item.amount)} €`]);
                        }
                    }

                    if (voluntaryTable.length > 0) {
                        autoTable(pdf, {
                            startY: y,
                            head: [[t('Bezeichnung'), t('Betrag')]],
                            body: voluntaryTable,
                            theme: 'grid',
                            headStyles: { fillColor: [100, 100, 100] },
                            margin: { left: margin, right: margin },
                            styles: { font: currentFont }
                        });

                        y = pdf.lastAutoTable.finalY + 10;
                    } else {
                        addTwoColumnRow(t('Keine freiwilligen Beiträge ausgewählt'), '');
                        y += 5;
                    }
                }
            }

            addDivider();

            // tax deductions
            checkPageBreak(60);
            addSubtitle(t('Steuerabzüge'));

            // monthly tax deductions
            if (taxDeductions.monthly) {
                y += 2;
                addSectionTitle(t('Monatliche Abzüge'));

                const monthlyTable = [];

                // standard monthly taxDeductions
                if (taxDeductions.monthly.krankenversicherung) {
                    monthlyTable.push([
                        t('Krankenversicherung'),
                        `${round(taxDeductions.monthly.krankenversicherung.amount)} €`,
                        taxDeductions.monthly.krankenversicherung.type === 'full' ? '100%' : '50%'
                    ]);
                }

                if (taxDeductions.monthly.buero && taxDeductions.monthly.buero.amount > 0) {
                    let officeSqm = taxDeductions.monthly.buero.officeSqm > 0 ? taxDeductions.monthly.buero.officeSqm : '?'

                    monthlyTable.push([
                        `${t('Büro/Arbeitszimmer')} (${officeSqm} m²)`,
                        `${round(taxDeductions.monthly.buero.amount)} €`,
                        '100%'
                    ]);
                }

                if (taxDeductions.monthly.internet) {
                    monthlyTable.push([
                        t('Internet'),
                        `${round(taxDeductions.monthly.internet.amount)} €`,
                        taxDeductions.monthly.internet.type === 'full' ? '100%' : '50%'
                    ]);
                }

                // custom monthly taxDeductions
                if (taxDeductions.monthly.custom && taxDeductions.monthly.custom.length > 0) {
                    for (const item of taxDeductions.monthly.custom) {
                        monthlyTable.push([
                            item.name || t('Benutzerdefiniert'),
                            `${round(item.amount)} €`,
                            item.type === 'full' ? '100%' : '50%'
                        ]);
                    }
                }

                if (monthlyTable.length > 0) {
                    // add VAT column to header if user is VAT payer
                    const tableHeaders = results.isVatPayer
                        ? [[t('Bezeichnung'), t('Betrag'), t('Abzugsart'), t('Vorsteuer')]]
                        : [[t('Bezeichnung'), t('Betrag'), t('Abzugsart')]];

                    // add VAT data if user is VAT payer
                    if (results.isVatPayer) {
                        for (const row of monthlyTable) {
                            let hasVat = false;
                            let vatAmount = 0;

                            if (row[0] === t('Krankenversicherung')) {
                                hasVat = taxDeductions.monthly.krankenversicherung?.hasVat || false;
                                vatAmount = taxDeductions.monthly.krankenversicherung?.vatAmount || 0;
                            } else if (row[0].includes(t('Büro/Arbeitszimmer'))) {
                                hasVat = taxDeductions.monthly.buero?.hasVat || false;
                                vatAmount = taxDeductions.monthly.buero?.vatAmount || 0;
                            } else if (row[0] === t('Internet')) {
                                hasVat = taxDeductions.monthly.internet?.hasVat || false;
                                vatAmount = taxDeductions.monthly.internet?.vatAmount || 0;
                            } else {
                                const customItem = taxDeductions.monthly.custom?.find(item =>
                                    row[0] === (item.name || t('Benutzerdefiniert'))
                                );
                                hasVat = customItem?.hasVat || false;
                                vatAmount = customItem?.vatAmount || 0;
                            }

                            // vat indicator
                            row.push(hasVat ? `${vatAmount} €` : '-');
                        }
                    }

                    autoTable(pdf, {
                        startY: y,
                        head: tableHeaders,
                        body: monthlyTable,
                        theme: 'grid',
                        headStyles: { fillColor: [100, 100, 100] },
                        margin: { left: margin, right: margin },
                        styles: { font: currentFont }
                    });

                    y = pdf.lastAutoTable.finalY + 10;
                } else {
                    addTwoColumnRow(t('Keine monatlichen Abzüge'), '');
                    y += 5;
                }
            }

            // one-time taxDeductions
            checkPageBreak(40);
            if (taxDeductions.oneTime) {
                addSectionTitle(t('Einmalige Ausgaben'));

                const oneTimeTable = [];

                // custom one-time taxDeductions
                if (taxDeductions.oneTime.custom && taxDeductions.oneTime.custom.length > 0) {
                    for (const item of taxDeductions.oneTime.custom) {
                        oneTimeTable.push([
                            item.name || t('Benutzerdefiniert'),
                            `${round(item.amount)} €`,
                            item.type === 'full' ? '100%' : '50%'
                        ]);
                    }
                }

                if (oneTimeTable.length > 0) {
                    // add VAT column to header if user is VAT payer
                    const tableHeaders = results.isVatPayer
                        ? [[t('Bezeichnung'), t('Betrag'), t('Abzugsart'), t('Vorsteuer')]]
                        : [[t('Bezeichnung'), t('Betrag'), t('Abzugsart')]];

                    // add VAT data if user is VAT payer
                    if (results.isVatPayer) {
                        oneTimeTable.forEach((row, index) => {
                            const item = taxDeductions.oneTime.custom[index];

                            row.push(item.hasVat ? `${item.vatAmount} €` : '-');
                        });
                    }

                    autoTable(pdf, {
                        startY: y,
                        head: tableHeaders,
                        body: oneTimeTable,
                        theme: 'grid',
                        headStyles: { fillColor: [100, 100, 100] },
                        margin: { left: margin, right: margin },
                        styles: { font: currentFont }
                    });

                    y = pdf.lastAutoTable.finalY + 10;
                } else {
                    addTwoColumnRow(t('Keine einmaligen Ausgaben'), '');
                    y += 5;
                }
            }

            // depreciation items
            checkPageBreak(40);
            if (taxDeductions.depreciation) {
                addSectionTitle(t('Abschreibungen'));

                const depreciationTable = [];

                if (taxDeductions.depreciation.custom && taxDeductions.depreciation.custom.length > 0) {
                    for (const item of taxDeductions.depreciation.custom) {
                        depreciationTable.push([
                            item.name || t('Anschaffung'),
                            `${round(item.amount)} €`,
                            item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-',
                            `${item.usefulLifeYears || '-'} ${t('Jahre')}`,
                            item.method === 'linear' ? t('Linear') : t('Degressiv')
                        ]);
                    }
                }

                if (depreciationTable.length > 0) {
                    // add VAT column to header if user is VAT payer
                    const tableHeaders = results.isVatPayer
                        ? [[t('Bezeichnung'), t('Betrag'), t('Kaufdatum'), t('Nutzungsdauer'), t('Methode'), t('Vorsteuer')]]
                        : [[t('Bezeichnung'), t('Betrag'), t('Kaufdatum'), t('Nutzungsdauer'), t('Methode')]];

                    // add VAT data to each row if user is VAT payer
                    if (results.isVatPayer) {
                        depreciationTable.forEach((row, index) => {
                            const item = taxDeductions.depreciation.custom[index];
                            row.push(item.hasVat ? `${item.vatAmount} €` : '-');
                        });
                    }

                    autoTable(pdf, {
                        startY: y,
                        head: tableHeaders,
                        body: depreciationTable,
                        theme: 'grid',
                        headStyles: { fillColor: [100, 100, 100] },
                        margin: { left: margin, right: margin },
                        styles: { font: currentFont }
                    });

                    y = pdf.lastAutoTable.finalY + 10;
                } else {
                    addTwoColumnRow(t('Keine Abschreibungen'), '');
                    y += 5;
                }
            }

            // footer
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(150, 150, 150);

                // page numeration
                pdf.text(
                    `${t('Seite')} ${i} ${t('von')} ${pageCount}`,
                    pageWidth - margin,
                    pdf.internal.pageSize.height - 10,
                    { align: 'right' }
                );

                pdf.text(
                    t('© bruttonetto.tools - Nur zur Information, keine steuerliche Beratung.'),
                    pageWidth / 2,
                    pdf.internal.pageSize.height - 10,
                    { align: 'center' }
                );
            }

            // download the PDF
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            pdf.save(`steuerberechnung_${date}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <button
            type="button"
            className={`${styles.exportButton} ${styles[theme]}`}
            onClick={handleExport}
            aria-label={t('Als PDF exportieren')}
        >
            <DownloadIcon width={24} height={24} />
            {t('Als PDF exportieren')}
        </button>
    );
};

export default ExportPdfButton;