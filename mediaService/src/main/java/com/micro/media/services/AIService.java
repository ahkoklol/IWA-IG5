package com.micro.media.services;

import com.micro.media.client.AIGrpcClient;
import org.springframework.stereotype.Service;
import com.micro.media.entity.AiResultDTO;

import java.io.File;

@Service
public class AIService {

    private final AIGrpcClient aiGrpcClient;

    public AIService(AIGrpcClient aiGrpcClient) {
        this.aiGrpcClient = aiGrpcClient;
    }

    /**
     * Hook pour envoyer l'image au service IA via gRPC (ou simulation pour l'instant).
     * Le client gRPC est séparé pour pouvoir remplacer facilement l'implémentation.
     */
    public AiResultDTO sendToAIService(File imageFile, String imageUrl) {
        // Délègue l'appel au client gRPC (simulé pour l'instant)
        return aiGrpcClient.analyze(imageFile, imageUrl);
    }

    /**
     * Votre logique personnalisée pour valider le résultat de l'IA
     * Fonction séparée pour faciliter les modifications
     */
    public boolean validateAIResult(AiResultDTO aiResult) {
        // Vos critères de validation personnalisés
        if (aiResult.getConfidence() < 0.7) {
            return false; // Confiance trop faible
        }

        if (!aiResult.isValid()) {
            return false; // L'IA dit que l'image n'est pas valide
        }

        // Ajoutez ici d'autres critères selon vos besoins
        return true;
    }

    /**
     * Valide une image via l'IA et retourne si elle est approuvée.
     * Combine l'analyse IA et la validation du résultat.
     *
     * @param imageFile fichier image à analyser
     * @param imageUrl URL de l'image (pour référence)
     * @return true si l'image est approuvée, false sinon
     */
    public boolean validateImage(File imageFile, String imageUrl) {
        AiResultDTO aiResult = sendToAIService(imageFile, imageUrl);
        return validateAIResult(aiResult);
    }
}
