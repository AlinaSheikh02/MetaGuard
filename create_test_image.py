import piexif
from PIL import Image

# Create a small blank image
img = Image.new('RGB', (100, 100), color='red')
img.save('e:/mdata/test.jpg', 'jpeg')

# Create EXIF dictionary
zeroth_ifd = {
    piexif.ImageIFD.Make: u"TestDevice",
    piexif.ImageIFD.Model: u"TestModel v1.0",
    piexif.ImageIFD.Software: u"TestOS"
}
exif_ifd = {
    piexif.ExifIFD.DateTimeOriginal: u"2026:03:29 12:00:00",
}
gps_ifd = {
    piexif.GPSIFD.GPSLatitudeRef: 'N',
    piexif.GPSIFD.GPSLatitude: ((37, 1), (46, 1), (3000, 100)),
    piexif.GPSIFD.GPSLongitudeRef: 'W',
    piexif.GPSIFD.GPSLongitude: ((122, 1), (25, 1), (5000, 100))
}

exif_dict = {"0th": zeroth_ifd, "Exif": exif_ifd, "GPS": gps_ifd}
exif_bytes = piexif.dump(exif_dict)

piexif.insert(exif_bytes, 'e:/mdata/test.jpg')
print("Test image created with EXIF data.")
