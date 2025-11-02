package com.micro.media.services;

import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class AIService {

//    private final AiGrpcClient aiGrpcClient;
//
//    public AIService(AiGrpcClient aiGrpcClient) {
//        this.aiGrpcClient = aiGrpcClient;
//    }

    /**
     * Hook pour envoyer l'image au service IA via gRPC (ou simulation pour l'instant).
     * Le client gRPC est séparé pour pouvoir remplacer facilement l'implémentation.
     */
    public AIServiceResult sendToAIService(File imageFile, String imageUrl) {
//        // Délègue l'appel au client gRPC (simulé pour l'instant)
//        return aiGrpcClient.analyze(imageFile, imageUrl);
        return new AIServiceResult(true, 0.95, "Simulation IA - image valide");
    }

    /**
     * Votre logique personnalisée pour valider le résultat de l'IA
     * Fonction séparée pour faciliter les modifications
     */
    public boolean validateAIResult(AIServiceResult aiResult) {
        // Vos critères de validation personnalisés
        if (aiResult.confidence() < 0.7) {
            return false; // Confiance trop faible
        }

        if (!aiResult.isValid()) {
            return false; // L'IA dit que l'image n'est pas valide
        }

        // Ajoutez ici d'autres critères selon vos besoins
        return true;
    }

    public record AIServiceResult(boolean isValid, double confidence, String description) {
    }
}
