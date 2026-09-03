import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "./uploadthing"

// Generate helpers for client-side usage
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
