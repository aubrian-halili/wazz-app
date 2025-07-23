/**
 * Utility functions for formatting dates in GraphQL responses
 */

/**
 * Converts a Date object to ISO string format
 * @param date - Date object or string
 * @returns ISO string or original value if not a Date
 */
export const formatDateToISO = (date: any): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
};

/**
 * Common date field resolvers
 */
export const dateFieldResolvers = {
  createdAt: (parent: any) => formatDateToISO(parent.createdAt),
  updatedAt: (parent: any) => formatDateToISO(parent.updatedAt),
};
