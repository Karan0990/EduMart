import cloudinary from "@/config/cloudinary";

export async function uploadToCloudinary(
    file: File,
    folder: string
): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
        ).end(buffer);
    });

    return result.secure_url;
}
