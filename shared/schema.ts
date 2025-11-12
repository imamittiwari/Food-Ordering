import { pgTable, text, serial, integer, doublePrecision, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
});

// Menu Items Table
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isPopular: boolean("is_popular").default(false),
  isSeasonal: boolean("is_seasonal").default(false),
  isCombo: boolean("is_combo").default(false),
  dietaryPreferences: jsonb("dietary_preferences"), // ["vegetarian", "vegan", "gluten-free", etc.]
  nutritionalInfo: jsonb("nutritional_info"), // {calories, protein, carbs, fat, allergens, ingredients}
  availableAddons: jsonb("available_addons"), // [{name, price, category}]
  comboItems: jsonb("combo_items"), // For combo meals: [{menuItemId, quantity, discount}]
  discountPercentage: doublePrecision("discount_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  items: jsonb("items").notNull(),
  status: text("status").notNull().default("pending"),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  address: text("address"),
  paymentId: text("payment_id"),
});

// Cart Items Table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  selectedAddons: jsonb("selected_addons"), // Selected add-ons for customization
  specialInstructions: text("special_instructions"), // Special preparation instructions
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Preferences Table (for AI recommendations)
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  preferredCategories: jsonb("preferred_categories"), // ["pizza", "burgers", etc.]
  dietaryRestrictions: jsonb("dietary_restrictions"), // ["vegetarian", "gluten-free", etc.]
  favoriteItems: jsonb("favorite_items"), // [menuItemId1, menuItemId2, etc.]
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  isAdmin: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  isPopular: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  items: true,
  total: true,
  address: true,
  paymentId: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  menuItemId: true,
  quantity: true,
});

// Helper schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP Code is required"),
  phone: z.string().min(1, "Phone number is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type User = typeof users.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;

export type CartItemWithDetails = CartItem & {
  menuItem: MenuItem;
};

export type OrderWithItems = Order & {
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
  }>;
};

export type OrderStatus = 'pending' | 'processing' | 'delivering' | 'delivered' | 'cancelled';
