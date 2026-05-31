import { AdminIcon as AdminIcon_b1adc345242794e96614a28e4dd743c5 } from '@/app/components/AdminIcon'
import { AdminLogo as AdminLogo_4c3e1e2580234bb8953ec613a22a2b5e } from '@/app/components/AdminLogo'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@/app/components/AdminIcon#AdminIcon": AdminIcon_b1adc345242794e96614a28e4dd743c5,
  "@/app/components/AdminLogo#AdminLogo": AdminLogo_4c3e1e2580234bb8953ec613a22a2b5e,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
