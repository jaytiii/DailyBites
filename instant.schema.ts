import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      displayName: i.string().optional(),
      bio: i.string().optional(),
      imageURL: i.string().optional()
    }),
    meals: i.entity({
      userId: i.string().indexed(),
      title: i.string(),
      mealType: i.string(),
      date: i.date().indexed(),
      notes: i.string().optional(),
      dietLabel: i.string(),
      prepTime: i.string(),
      ingredients: i.string().optional(),
      steps: i.string().optional(),
      hasRecipe: i.boolean(),
      createdAt: i.date().indexed()
    })
  },
  links: {},
  rooms: {}
});

export default _schema;

