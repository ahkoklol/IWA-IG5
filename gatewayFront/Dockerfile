FROM eclipse-temurin:21-jre-alpine AS builder
WORKDIR /build
COPY target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:21-jre-alpine
RUN addgroup --system spring && adduser -S spring -G spring
USER spring
WORKDIR /app
COPY --from=builder /build/dependencies/ ./
COPY --from=builder /build/spring-boot-loader/ ./
COPY --from=builder /build/snapshot-dependencies/ ./
COPY --from=builder /build/application/ ./
EXPOSE 8091
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
