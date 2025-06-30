import { UserIdType } from 'maruyu-webcommons/commons/types/user';
import mongoose from 'mongoose';

const resourceKeyList = ["token","credential","apiKey"] as const
type resourceKeyType = typeof resourceKeyList[number];

export type CredentialType = {
  clientId: string,
  clientSecret: string,
  redirectUri: string,
}
export type TokenType = {
  tokenType: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  scope: string,
}
export type ApiKeyType = {
  tokenType: string,
  apiKey: string,
  scope: string,
}

type CertificationType = {
  userId: UserIdType,
  service: string,
  resourceKey: resourceKeyType,
  data: CredentialType|TokenType|ApiKeyType,
}

const CertificationModel = mongoose.model<CertificationType>('certification',
  (()=>{
    const schema = new mongoose.Schema<CertificationType>({
      userId: {
        type: String,
        required: true
      },
      service: {
        type: String,
        required: true
      },
      resourceKey: {
        type: String,
        enum: resourceKeyList,
        required: true
      },
      data: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        optional: true
      }
    }, {
      timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
      }
    })
    schema.index({ userId:1, service: 1, resourceKey: 1 }, { unique: true })
    return schema;
  })()
);

export default CertificationModel;