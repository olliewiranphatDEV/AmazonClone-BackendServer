const prisma = require('../models')

// ,later "script" :
//   "prisma": {
//     "seed": "node prisma/seed.js"
//   },



// ///// Category Data: 
// const categoryData = [
//     { name: "Arts & Crafts" },
//     { name: "Automotive" },
//     { name: "Baby" },
//     { name: "Beauty & Personal Care" },
//     { name: "Books" },
//     { name: "Boys' Fashion" },
//     { name: "Computers" },
//     { name: "Deals" },
//     { name: "Digital Music" },
//     { name: "Electronics" },
//     { name: "Girls' Fashion" },
//     { name: "Health & Household" },
//     { name: "Home & Kitchen" },
//     { name: "Industrial & Scientific" },
//     { name: "Kindle Store" },
//     { name: "Luggage" },
//     { name: "Men's Fashion" },
//     { name: "Movies & TV" },
//     { name: "Music, CDs, & Vinyl" },
//     { name: "Pet Supplies" },
//     { name: "Prime Video" },
//     { name: "Software" },
//     { name: "Software" },
//     { name: "Sports & Outdoors" },
//     { name: "Tools & Home Improvement" },
//     { name: "Toys & Games" },
//     { name: "Video Games" },
//     { name: "Women's Fashion" },

// ]

// ///// Product Data
const productsData = [
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740739517/ProductImage/1740739515059.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740739603/ProductImage/1740739597171.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740739607/ProductImage/1740739604075.jpg" },

        ],
        productName: "BENGOO G9000 Stereo Gaming Headset for PS4 PC Xbox One PS5 Controller, Noise Cancelling Over Ear Headphones with Mic, LED Light, Bass Surround, Soft Memory Earmuffs for Nintendo",
        description: "Support PlayStation 4, New Xbox One, PC, Nintendo 3DS, Laptop, PSP, Tablet, iPad, Computer, Mobile Phone. Please note you need an extra Microsoft Adapter (Not Included) when connect with an old version Xbox One controller.",
        stockQuantity: 25,
        price: 19.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740740165/ProductImage/1740740156287.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740740171/ProductImage/1740740166793.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740740174/ProductImage/1740740171791.jpg" },

        ],
        productName: "Moforoco Adhesive Shower Caddy Organizer Shelves Rack - 5 Pack Corner Bathroom Storage Organization, Home & Kitchen Decor Inside RV Accessories, Hanging First Apartment Household Camper Essentials",
        description: "Our shower shelves are made of 100% stainless steel, rust-proof and sturdy. The spacer design at the bottom can help drain and dry quickly, avoiding harmful substances in humid environments. It is an ideal choice for supplementing your bathroom.",
        categoryName: "Home & Kitchen",
        stockQuantity: 50,
        price: 15.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741019/ProductImage/1740740985941.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741118/ProductImage/1740741115274.jpg" }
        ],
        productName: "EMMIOL Denim Jeans for Women Wide Leg Jeans Low Waist Baggy Jeans for Women Loose Boyfriends Jeans Denim Pants Y2K 90S",
        description: "Baggies jeans for women with soft, breathable, durable and friendly to skin denim fabric can meet your needs to wear for the whole day. These jeans for women can be well paired with colorful tops for a perfect look.",
        categoryName: "Women's Fashion",
        stockQuantity: 50,
        price: 39.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741367/ProductImage/1740741364725.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741369/ProductImage/1740741368403.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741375/ProductImage/1740741370497.jpg" },

        ],
        productName: "Straight Leg Jeans for Women,High Waisted Wide Leg Loose Microelastic Boyfried Denim Pants",
        description: "Comfortable Relaxed Fit: The wide-leg design provides a comfortable wearing experience, showcasing a laid-back and casual boyfriend style that allows you to move with ease in any situation.",
        categoryName: "Women's Fashion",
        stockQuantity: 60,
        price: 41.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741796/ProductImage/1740741791326.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741853/ProductImage/1740741850111.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740741856/ProductImage/1740741854293.jpg" },

        ],
        productName: "Instant Pot Duo 7-in-1 Mini Electric Pressure Cooker, Slow Rice Cooker, Steamer, Sauté, Yogurt Maker, Warmer & Sterilizer, Includes Free App with over 1900 Recipes, Stainless Steel, 3 Quart",
        description: "COOK FAST OR SLOW: Pressure cook delicious one-pot meals up to 70% faster than traditional cooking methods or slow cook your favorite traditional recipes – just like grandma used to make.",
        categoryName: "Home & Kitchen",
        stockQuantity: 35,
        price: 79.95
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740742422/ProductImage/1740742417538.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740742427/ProductImage/1740742422923.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740742433/ProductImage/1740742428790.jpg" },

        ],
        productName: "AULA Keyboard, Gaming Keyboard and Mouse Combo with RGB Backlit Quiet Computer Keyboard, All-Metal Panel, Waterproof Light Up PC Keyboard",
        description: "RGB Rainbow Backlit Keyboard: The keyboard mouse combo is through rainbow backlit keyboard and RGB breathable backlit mouse, you can customize the keyboard backlight/brightness/speed.",
        categoryName: "Video Games",
        stockQuantity: 45,
        price: 31.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740743452/ProductImage/1740743449087.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740743453/ProductImage/1740743452884.jpg" }
        ],
        productName: "Smart Watch, 1.85 HD Smartwatch for Men Women",
        description: "Bluetooth Call and Voice Assistant: Smart watch built-in microphone and HD speaker, you can make and receive calls directly from this smart watches for men.",
        categoryName: "Electronics",
        stockQuantity: 55,
        price: 29.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740751965/ProductImage/1740751963628.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740751966/ProductImage/1740751966442.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740751967/ProductImage/1740751967409.jpg" }
        ],
        productName: "Ninja Pod & Grounds Specialty Single-Serve Coffee Maker",
        description: "BREW WITH PODS OR GROUNDS: Brew a single-serve cup of coffee with grounds for ultimate flavor or with a coffee pod for ultimate convenience in one small footprint.",
        categoryName: "Home & Kitchen",
        stockQuantity: 30,
        price: 79.99
    },
    {
        ImageData: [
            { id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740752333/ProductImage/1740752331204.jpg" },
            { id: 2, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740752355/ProductImage/1740752353664.jpg" },
            { id: 3, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740752357/ProductImage/1740752356613.jpg" }
        ],
        productName: "Facial Massager Beauty Tool for Face and Neck",
        description: "This professional red light therapy device features 3 customizable modes (Daily, Focus, Deep) to suit all skin types. ",
        categoryName: "Beauty & Personal Care",
        stockQuantity: 20,
        price: 129.99
    },
    {
        ImageData: [{ id: 1, secure_url: "https://res.cloudinary.com/olliewiranphat/image/upload/v1740752778/ProductImage/1740752776367.jpg" }],
        productName: "The Let Them Theory: A Life-Changing Tool That Millions of People Can't Stop Talking About ",
        description: "Cook healthier meals with little to no oil, featuring adjustable temperature and presets.",
        categoryName: "Books",
        stockQuantity: 40,
        price: 109.99
    }
];


async function seedDB() {
    await prisma.category.createMany({ data: categoryData })
}

seedDB() // npx prisma db seed