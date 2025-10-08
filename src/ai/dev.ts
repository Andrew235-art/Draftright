import { config } from 'dotenv';
config();

import '@/ai/flows/generate-email-draft.ts';
import '@/ai/flows/control-output-language.ts';