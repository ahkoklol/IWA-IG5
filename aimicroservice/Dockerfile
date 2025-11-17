FROM eclipse-temurin:21-jre-alpine

ARG JAR_FILE

RUN addgroup --system spring && adduser -S spring -G spring
USER spring

WORKDIR /app

COPY ${JAR_FILE} app.jar

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "/app.jar"]