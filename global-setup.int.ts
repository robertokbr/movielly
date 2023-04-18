import { config } from 'dotenv';

export default async function() {
  config({
    path: '.env.test',
  });
}
