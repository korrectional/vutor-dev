import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

import { client } from '@/services/db'; // your mongodb client

export const auth = betterAuth({
  database: mongodbAdapter(client.db()), // adapt it into mongodb (our database)
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000","https://0801-75-52-101-39.ngrok-free.app"],
  user: {
    additionalFields: {
      full_name: {
        type: "string",
        required: false,
        defaultValue: "user"
      },
      description: { // the user describes themselves (useful for tutors)
        type: "string",
        required: false,
        defaultValue: "",
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user"
      },
      phone_number: {
        type: "number",
        required: false,
        defaultValue: "NONE PROVIDED",
      }
    }
 }

});

type Session = typeof auth.$Infer.Session


/*
  user: {
    additionalFields: { 
      full_name: {
          type: "string",
          required: true,
          defaultValue: "NO_NAME",
      },
      description: { // the user describes themselves (useful for tutors)
          type: "string",
          required: false,
          defaultValue: "",
      },
      languages: { // this one is useful
        type: "string[]",
        required: true,
        defaultValue: "en",
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
      },
      phone_number: {
        type: "string",
        required: true,
        defaultValue: "NONE PROVIDED",
      }
    }
  },

*/