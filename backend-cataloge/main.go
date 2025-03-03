// main.go
package main

import (
	"backend-cataloge/db"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Initialiser la connexion à la base de données
	db.Connect()
	defer db.Disconnect()

	// Créer une instance de l'application Fiber
	app := fiber.New()

	// Middleware de log
	app.Use(logger.New())

	// Routes CRUD pour l'admin
	app.Post("/admin/products", createProduct)
	app.Get("/admin/products", getAllProducts)
	app.Get("/admin/products/:id", getProductByID)
	app.Put("/admin/products/:id", updateProduct)
	app.Delete("/admin/products/:id", deleteProduct)

	// Route de recherche pour les clients
	app.Get("/products/search", searchProducts)

	// Démarrer le serveur
	log.Fatal(app.Listen(":3000"))
}

// Create a new product
func createProduct(c *fiber.Ctx) error {
	var product struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
	}

	// Parse le corps de la requête
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	// Insérer dans la base de données
	var id int
	err := db.DB.QueryRow(
		"INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING id",
		product.Name, product.Description, product.Price,
	).Scan(&id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error inserting product")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

// Get all products
func getAllProducts(c *fiber.Ctx) error {
	rows, err := db.DB.Query("SELECT id, name, description, price FROM products")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error fetching products")
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var product struct {
			ID          int     `json:"id"`
			Name        string  `json:"name"`
			Description string  `json:"description"`
			Price       float64 `json:"price"`
		}
		if err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error scanning row")
		}
		products = append(products, map[string]interface{}{
			"id":          product.ID,
			"name":        product.Name,
			"description": product.Description,
			"price":       product.Price,
		})
	}

	return c.JSON(products)
}

// Get product by ID
func getProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var product struct {
		ID          int     `json:"id"`
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
	}

	err := db.DB.QueryRow("SELECT id, name, description, price FROM products WHERE id = $1", id).Scan(
		&product.ID, &product.Name, &product.Description, &product.Price,
	)
	if err != nil {
		return c.Status(fiber.StatusNotFound).SendString("Product not found")
	}

	return c.JSON(product)
}

// Update product by ID
func updateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
	}

	// Parse le corps de la requête
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	// Mettre à jour le produit
	_, err := db.DB.Exec("UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4",
		product.Name, product.Description, product.Price, id,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error updating product")
	}

	return c.Status(fiber.StatusOK).SendString("Product updated")
}

// Delete product by ID
func deleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	_, err := db.DB.Exec("DELETE FROM products WHERE id = $1", id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error deleting product")
	}

	return c.Status(fiber.StatusNoContent).SendString("Product deleted")
}

// Search products for clients
func searchProducts(c *fiber.Ctx) error {
	query := c.Query("query", "")
	rows, err := db.DB.Query("SELECT id, name, description, price FROM products WHERE name ILIKE $1 OR description ILIKE $1", "%"+query+"%")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error searching products")
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var product struct {
			ID          int     `json:"id"`
			Name        string  `json:"name"`
			Description string  `json:"description"`
			Price       float64 `json:"price"`
		}
		if err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error scanning row")
		}
		products = append(products, map[string]interface{}{
			"id":          product.ID,
			"name":        product.Name,
			"description": product.Description,
			"price":       product.Price,
		})
	}

	return c.JSON(products)
}
