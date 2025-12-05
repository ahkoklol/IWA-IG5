FROM eclipse-temurin:21-jre-alpine AS builder
WORKDIR /build
COPY target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:21-jre-alpine
RUN addgroup --system spring && adduser -S spring -G spring

WORKDIR /app
# Copier les couches extraites depuis le builder (exécuté en root)
COPY --from=builder /build/dependencies/ ./
COPY --from=builder /build/spring-boot-loader/ ./
COPY --from=builder /build/snapshot-dependencies/ ./
COPY --from=builder /build/application/ ./

# Donner la propriété au user non-root avant de basculer
RUN chown -R spring:spring /app

USER spring
EXPOSE 8091

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
