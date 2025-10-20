import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Seed Products
  const products = [
    {
      name: "Team Jersey",
      description: "Official Stormers360 tournament jersey with breathable fabric",
      price: 4599,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
      inStock: 1
    },
    {
      name: "Basketball",
      description: "Official 3x3 basketball - FIBA approved",
      price: 2999,
      category: "Equipment",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
      inStock: 1
    },
    {
      name: "Sweatband Set",
      description: "Sweat-wicking headband and wristband combo",
      price: 1299,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
      inStock: 0
    },
    {
      name: "Hoops Cap",
      description: "Adjustable basketball cap with Stormers360 logo",
      price: 2499,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
      inStock: 1
    },
    {
      name: "Training Shorts",
      description: "Performance athletic shorts with deep pockets",
      price: 3499,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
      inStock: 1
    },
    {
      name: "Water Bottle",
      description: "Insulated 1L water bottle - keeps drinks cold",
      price: 1599,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      inStock: 1
    },
  ];

  for (const product of products) {
    await storage.createProduct(product);
  }

  console.log(`Created ${products.length} products`);

  // Seed Courts
  const courts = [
    {
      name: "Campus Central Court",
      location: "University Paul Sabatier",
      university: "Paul Sabatier",
      city: "Toulouse",
      latitude: "43.5617",
      longitude: "1.4658",
      availability: "available",
      contactInfo: "contact@paul-sabatier.fr",
      sponsorVisibility: 1250
    },
    {
      name: "Jean Jaurès Basketball Arena",
      location: "Place Jean Jaurès",
      university: null,
      city: "Toulouse",
      latitude: "43.6083",
      longitude: "1.4483",
      availability: "available",
      contactInfo: "jeanjau res@toulouse.fr",
      sponsorVisibility: 2100
    },
    {
      name: "Capitole Court",
      location: "University of Toulouse Capitole",
      university: "Toulouse Capitole",
      city: "Toulouse",
      latitude: "43.6045",
      longitude: "1.4440",
      availability: "available",
      contactInfo: "sports@ut-capitole.fr",
      sponsorVisibility: 980
    },
    {
      name: "INSA Sports Complex",
      location: "INSA Toulouse",
      university: "INSA",
      city: "Toulouse",
      latitude: "43.5697",
      longitude: "1.4647",
      availability: "booked",
      contactInfo: "sports@insa-toulouse.fr",
      sponsorVisibility: 1560
    },
    {
      name: "Mirail University Courts",
      location: "University of Toulouse-Jean Jaurès",
      university: "Jean Jaurès",
      city: "Toulouse",
      latitude: "43.5796",
      longitude: "1.4027",
      availability: "available",
      contactInfo: "sports@univ-tlse2.fr",
      sponsorVisibility: 850
    },
    {
      name: "Purpan Outdoor Court",
      location: "Campus Purpan",
      university: "ENVT",
      city: "Toulouse",
      latitude: "43.6123",
      longitude: "1.3993",
      availability: "available",
      contactInfo: "purpan@envt.fr",
      sponsorVisibility: 650
    }
  ];

  for (const court of courts) {
    await storage.createCourt(court);
  }

  console.log(`Created ${courts.length} courts`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
