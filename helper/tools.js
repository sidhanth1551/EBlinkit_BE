export const tools = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          //unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
  // {
  //   type: "function",
  //   function: {
  //     name: "get_products_byCategory",
  //     description:
  //       "Get all the products listed under same category and just provide product name in return",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         category: {
  //           type: "string",
  //           enum: [
  //             "fruits",
  //             "vegetables",
  //             "beverages",
  //             "Soft Drinks",
  //             "vegetables and fruits",
  //           ],
  //           description:
  //             "type of products, e.g. Beverages, cool drinks ,Vegetables & Fruits.",
  //         },
  //         //unit: { type: "string", enum: ["celsius", "fahrenheit"] },
  //       },
  //       required: ["category"],
  //     },
  //   },
  // },

  {
    type: "function",
    function: {
      name: "get_products_byCategory",
      description:
        "Get all the products listed under same category and just provide product name in return",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["Electronics", "speakers", "phones", "cameras"],
            description:
              "type of products, e.g. Electronics, speakers ,phones , cameras, bluetooth speakers",
          },
          //unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products_by_brandName",
      description:
        "Get all the products listed under same brand name such as sony, samsung,apple, jbl, nikon,",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            enum: ["sony", "apple", "samsung", "nikon"],
            description:
              "brand name of products, e.g. sony, samsung ,apple , apple, etc",
          },
          //unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products_by_description",
      description:
        "Sort out and give the list based on description of the category...such as a wireless speaker in a description should return all wireless products under speakers category",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            enum: [
              "wireless",
              "bluetooth",
              "color",
              "RAM",
              "size",
              "price",
              "camera",
              "display",
              "chip",
              "battery",
            ],
            description:
              "1.showe me phones of 12GB RAM, Then here RAM is description under phone category. 2.show me bluetooth speakers here bluetooth is description under speaker category.",
          },
          //unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["name"],
      },
    },
  },
];
