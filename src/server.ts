import {
  BookRoutes,
  genreRoutes,
  AuthorRoutes,
  AuthRoutes,
  UserRoutes,
  AdminRoutes,
  SuperRoutes,
} from "@routes";
import { app, connection, initServer } from "@config";
import { handleError, notFound } from "@middlewares";

connection(() => {
  //server init
  initServer(app);

  //routes
  app.use("/book", BookRoutes);
  app.use("/genre", genreRoutes);
  app.use("/author", AuthorRoutes);
  app.use("/auth", AuthRoutes);






















  app.use("/User", UserRoutes);
























  
  app.use("/admin", AdminRoutes);
  app.use("/super", SuperRoutes);

  // middlewares
  app.use(notFound);
  app.use(handleError);
});
