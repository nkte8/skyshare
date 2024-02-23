import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage';
import { storageUrl } from './vars';
import * as serviceAccount from './service_account.json'
const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
}

const adminApp = getStorage(initializeApp({
    credential: cert(params),
    storageBucket: storageUrl
}));
export default adminApp