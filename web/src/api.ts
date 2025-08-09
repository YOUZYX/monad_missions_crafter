import { z } from 'zod';

export const MissionSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  rules: z.array(z.string()),
  prizes: z.array(z.string()),
  resources: z.array(z.string()).optional(),
});

export type Mission = z.infer<typeof MissionSchema>;
