// src/lib/firebaseAdmin.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Replace the following with your actual Firebase project credentials
const firebaseAdminConfig = {
  "type": "service_account",
  "project_id": "next-ecommerce-5beb4",
  "private_key_id": "96200e0fb06ada30b76d8803db6375b8713d127b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuAIdiWoAQljPw\nHfbC55Ec48TZOY2EX6MCZPV+9DBq2kKlYtKXr0QcqYND5Ozvwjx2UsH4C0F9hsBm\n/41k2dVLsRm+LjxwuEDgNXQY4VZZzWOCIfUafnnfb92N+Cgdnp8jeHYQjbdWvJuG\nREYvcHx5D87LiB93EwHIssfRF7Va3V5VusSalCYQwUExKY6ViVsG8xQMlMq0/Ntj\nuKi5nIp7ztfbwv+AWXQ4FUThBXYOn1JiKhyPQDd/lIzgf75qykQCGneDE5UmxGI4\n3tQP0fQAreCjSzNDPR3tr1C5PSrfbF8aVH6ASbUADv+XzvwrCEqJSaAKjZOAECpK\nV1fqu/yzAgMBAAECggEABmo7k4sy8dRFJELz4C9UYMR0SJlAF+jEuZJfoKdqX44e\nFeXaThWmml3qL9HGpczl7hYn/jfqrrDjSAjU6CpwcYLH0wShCCYq3M6WXKfLcgfJ\n9Y1rRrzx9k8JU9zEcdnGvofdkR0AbOC1j9Iq5Ost6PKwaj2MV2yqd1aWr6VC849q\nhKLxn939lUkhuHNmUZEcZC7ZbPgx7C38EQP+0QQhf2xNEkkGxPOCJ4NgoRYqwL8N\nBnwMnVGlkFXGBJfuMtYRIAntWaH7aE363ES0jTLS+gONWjtrMLBH86wiQAG9Pt8c\nfjVBU890VGp0gGAe5DHufcFUdjMxaGdVNdMeK8SOwQKBgQDWdMd5ysFsSBdzoUSh\nxhck5bMqYvnXvlC1tQ9A2Ri8DQbjTS+Plfens3PwbszZmEIaiznnT24sTU56TH52\nzPvYKi2YiQOsjgSJMX3HJ/sDPwA2OTC3372lCqJ3jXLwSJRWz3ETudKzu73Kh9o9\nkCQgerdzaEcCSSbWHWpIsAX2QQKBgQDPtZEQWIaNAdHexUyo5eXhlWbNulC9jxP0\nfBkUj7s34rKAGwGWTubmYs9ngPzjbLm9P48XdIWle8Ty+6Hop4IamgaKgh+e5MhX\ngqX97GikfNLVgdfvIYKMMWSxCQncuIjPxKMnIo+kTpCBWUe6/KJLdxzO9+MMX+PF\nmV6SJXX98wKBgCBh8d0KKLrZB/GF4H8tEkGYDb3QxDk3m6hUdsEsBvgeX3PjK9Na\nqdLA3jjoAja5LwIjE9NBwzkdU0RUWKRHv5+cftYRmmRr7XNp7bws5VJQKRAHArxB\nJLnPKUk0Kq7txrh1CnYYESDisH3slZ/GLC5bWWgrzs0hjqO2PV5MdhoBAoGBAJev\nTMTXIUuQbKd3BkjBu2NGK9FJovULq9L7XYV6gYqKbzjGgB44eL7+oeBAfm3HVM0z\nwVerrH3xKR8ZTGAPFCBBI027QURUZ0ohCv+oybJ1xbJOJFdp7WBcIeB3bVBXIvI3\n8738q1GeXkFX5d5T6GGcFtm+hXzf+gKvwjSQTt6pAoGBAM2arqs4dL1+Rq7zrq2w\nMpIQVxxnFpIWd5ltmdJg67uUkNvmQhRUVL3EYM6H3HqRIuAzrg//WFSdWJhk9St4\noZBuuoOKZrWrXaBicgmnKEYzO514JDfiFulNALpodWVks5JyW0q0yuS2aBnODGom\n0dSU6cxuhVsCIFL7X3BRH7mm\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-jh02h@next-ecommerce-5beb4.iam.gserviceaccount.com",
  "client_id": "113781533921133459185",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jh02h%40next-ecommerce-5beb4.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

export const initFirebaseAdmin = () => {
  try {
    initializeApp({
      credential: cert(firebaseAdminConfig),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
};
