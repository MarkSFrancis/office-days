import { eq, sql } from 'drizzle-orm';
import {
  pgSchema,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgTable,
  uniqueIndex,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';

// #region Auth schema
// DO NOT CHANGE! Schema is generated by Supabase
const authSchema = pgSchema('auth');

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  email_confirmed_at: timestamp('email_confirmed_at', {
    withTimezone: true,
    mode: 'string',
  }),
  invited_at: timestamp('invited_at', { withTimezone: true, mode: 'string' }),
  last_sign_in_at: timestamp('last_sign_in_at', {
    withTimezone: true,
    mode: 'string',
  }),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  phone: text('phone'),
  phone_confirmed_at: timestamp('phone_confirmed_at', {
    withTimezone: true,
    mode: 'string',
  }),
  is_sso_user: boolean('is_sso_user').default(false).notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});
// #endregion

export const profiles = pgTable('profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarUrl: text('avatar_url'),
});

export const organizations = pgTable('organizations', {
  /**
   * Stored as a base64 URL encoded UUID v4
   */
  id: text('id').primaryKey(),
  displayName: text('display_name').notNull(),
  deletedOn: timestamp('deleted_on'),
});

export const rolesEnum = pgEnum('roles', ['OWNER', 'ADMIN', 'MEMBER']);

export const organizationUsers = pgTable(
  'organization_users',
  {
    id: serial('id').primaryKey(),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organizations.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    role: rolesEnum('role').notNull(),
    invitedOn: timestamp('invited_on').notNull(),
    invitedBy: uuid('invited_by').references(() => users.id, {
      onUpdate: 'set default',
      onDelete: 'set default',
    }),
  },
  (table) => ({
    organizationUserUnique: uniqueIndex('organization_users_unique').on(
      table.userId,
      table.organizationId
    ),
    oneOwnerPerOrganization: uniqueIndex('one_owner_per_organization')
      .on(table.organizationId)
      .where(eq(table.role, sql`'OWNER'`)),
  })
);