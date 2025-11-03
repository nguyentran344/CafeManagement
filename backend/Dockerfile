# Dùng image Java chính thức
FROM openjdk:17-jdk-slim

# Thư mục làm việc trong container
WORKDIR /app

# Copy file pom và mã nguồn vào
COPY . .

# Build project
RUN ./mvnw clean package -DskipTests

# Copy file jar build ra và chạy
CMD ["java", "-jar", "target/cafe-management-0.0.1-SNAPSHOT.jar"]
