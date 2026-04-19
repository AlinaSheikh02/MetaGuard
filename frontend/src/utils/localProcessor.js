import exifr from 'exifr';
import piexif from 'piexifjs';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function processFileLocally(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png'].includes(ext);
    
    let report = {
        id: crypto.randomUUID(),
        filename: file.name,
        metadata: [],
        score: 100,
        risk_level: 'Low',
        lat: null,
        lng: null,
        clean_url: null
    };

    let high_risk = 0;
    let med_risk = 0;
    let low_risk = 0;

    report.metadata.push({key: "Format", value: ext.toUpperCase(), risk: "Low"});
    report.metadata.push({key: "Size", value: `${(file.size / 1024).toFixed(2)} KB`, risk: "Low"});
    low_risk += 2;

    if (isImage) {
        // Parse Exif
        try {
            const exifData = await exifr.parse(file, {tiff: true, exif: true, gps: true});
            if (exifData) {
                for (const [k, v] of Object.entries(exifData)) {
                    if (['latitude', 'longitude'].includes(k)) {
                        if (k === 'latitude') report.lat = v;
                        if (k === 'longitude') report.lng = v;
                        
                        // We only want to push "GPS Coordinates" once
                        if (!report.metadata.some(m => m.key === "GPS Coordinates")) {
                            report.metadata.push({key: "GPS Coordinates", value: "Present", risk: "Critical"});
                            high_risk += 2;
                        }
                    } else if (k === 'Make' || k === 'Model' || k === 'Software' || k === 'DateTimeOriginal') {
                        let risk = "Low";
                        if (['Model', 'Make'].includes(k)) { risk = "Critical"; high_risk++; }
                        else if (k.includes('Date') || k.includes('Time') || k === 'Software') { risk = "Medium"; med_risk++; }
                        else { low_risk++; }
                        
                        if (typeof v === 'string' || typeof v === 'number') {
                             report.metadata.push({key: k, value: String(v).slice(0, 100), risk});
                        }
                    }
                }
            }
        } catch(e) {
             console.error("Exif extraction failed", e);
        }

        // Clean Image (only JPEG supported easily via piexif JS, PNG ignored for now or falls back)
        if (ext === 'jpg' || ext === 'jpeg') {
            try {
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve) => { 
                    reader.onload = () => resolve(reader.result); 
                    reader.readAsDataURL(file); 
                });
                const cleanExif = piexif.dump({"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "Interop": {}});
                const cleanData = piexif.insert(cleanExif, dataUrl);
                
                const res = await fetch(cleanData);
                const blob = await res.blob();
                report.clean_url = URL.createObjectURL(blob);
            } catch(e) {
                console.error("piexif error", e);
                report.clean_url = URL.createObjectURL(file);
            }
        } else {
             report.clean_url = URL.createObjectURL(file); // fallback
        }

    } else if (ext === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        try {
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const title = pdfDoc.getTitle();
            const author = pdfDoc.getAuthor();
            const creator = pdfDoc.getCreator();
            const producer = pdfDoc.getProducer();
            
            if (author) { report.metadata.push({key: 'Author', value: author, risk: 'Critical'}); high_risk++; }
            if (creator) { report.metadata.push({key: 'Creator', value: creator, risk: 'Critical'}); high_risk++; }
            if (producer) { report.metadata.push({key: 'Producer', value: producer, risk: 'Medium'}); med_risk++; }
            if (title) { report.metadata.push({key: 'Title', value: title, risk: 'Low'}); low_risk++; }

            // Clean PDF
            pdfDoc.setTitle('');
            pdfDoc.setAuthor('');
            pdfDoc.setSubject('');
            pdfDoc.setCreator('');
            pdfDoc.setProducer('');
            const cleanBytes = await pdfDoc.save();
            const blob = new Blob([cleanBytes], { type: 'application/pdf' });
            report.clean_url = URL.createObjectURL(blob);
        } catch(e) {
            report.clean_url = URL.createObjectURL(file);
        }
    } else if (['docx', 'xlsx', 'pptx'].includes(ext)) {
        // Office doc handling via JSZip
        const arrayBuffer = await file.arrayBuffer();
        try {
            const zip = await JSZip.loadAsync(arrayBuffer);
            
            // Extract from core.xml
            if (zip.file('docProps/core.xml')) {
                const coreXml = await zip.file('docProps/core.xml').async('text');
                if (coreXml.includes('<dc:creator>')) {
                    const creatorMatch = coreXml.match(/<dc:creator>(.*?)<\/dc:creator>/);
                    if(creatorMatch && creatorMatch[1]) { report.metadata.push({key: "Creator", value: creatorMatch[1], risk: "Critical"}); high_risk++; }
                }
                if (coreXml.includes('<cp:lastModifiedBy>')) {
                    const lmbMatch = coreXml.match(/<cp:lastModifiedBy>(.*?)<\/cp:lastModifiedBy>/);
                    if(lmbMatch && lmbMatch[1]) { report.metadata.push({key: "Last Modified By", value: lmbMatch[1], risk: "Critical"}); high_risk++; }
                }
            }

            // Extract from app.xml (Total Editing Time)
            if (zip.file('docProps/app.xml')) {
                const appXml = await zip.file('docProps/app.xml').async('text');
                if (appXml.includes('TotalTime>')) {
                    const timeMatch = appXml.match(/TotalTime.*?>(.*?)</);
                    if(timeMatch && timeMatch[1] && parseInt(timeMatch[1]) > 0) { 
                        report.metadata.push({key: "Total Editing Time", value: `${timeMatch[1]} mins`, risk: "Medium"}); med_risk++; 
                    }
                }
            }

            // Clean Document
            if (zip.file('docProps/core.xml')) {
                let coreXml = await zip.file('docProps/core.xml').async('text');
                coreXml = coreXml.replace(/<dc:creator>.*?<\/dc:creator>/g, '<dc:creator></dc:creator>');
                coreXml = coreXml.replace(/<cp:lastModifiedBy>.*?<\/cp:lastModifiedBy>/g, '<cp:lastModifiedBy></cp:lastModifiedBy>');
                zip.file('docProps/core.xml', coreXml);
            }
            if (zip.file('docProps/app.xml')) {
                let appXml = await zip.file('docProps/app.xml').async('text');
                appXml = appXml.replace(/<TotalTime>.*?<\/TotalTime>/g, '<TotalTime>0</TotalTime>');
                zip.file('docProps/app.xml', appXml);
            }

            const cleanContent = await zip.generateAsync({type:"blob"});
            report.clean_url = URL.createObjectURL(cleanContent);
        } catch(e) {
            report.clean_url = URL.createObjectURL(file);
        }
    } else {
        report.clean_url = URL.createObjectURL(file);
    }

    report.score = Math.max(0, 100 - (high_risk * 25) - (med_risk * 10));
    report.risk_level = high_risk > 0 ? 'Critical' : (med_risk > 0 ? 'Medium' : 'Low');

    return report;
}
