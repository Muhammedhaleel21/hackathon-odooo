import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_PORT: Joi.number().port().default(4000),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  DATABASE_URL: Joi.string()
    .uri({
      scheme: ['postgres', 'postgresql'],
    })
    .required(),
  JWT_ACCESS_SECRET: Joi.string().min(64).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: Joi.number().integer().positive().default(7),
  REFRESH_COOKIE_NAME: Joi.string().default('refresh_token'),
  PASSWORD_RESET_EXPIRES_IN_MINUTES: Joi.number().integer().positive().default(15),
  FRONTEND_RESET_URL: Joi.string().uri().required(),
  INITIAL_ADMIN_NAME: Joi.string().optional(),
  INITIAL_ADMIN_EMAIL: Joi.string().email({ tlds: false }).optional(),
  INITIAL_ADMIN_PASSWORD: Joi.string().optional(),
});
