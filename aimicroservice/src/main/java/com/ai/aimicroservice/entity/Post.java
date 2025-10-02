package com.ai.aimicroservice.entity;

public class Post {

    private String postId;
    private String description;
    private String imageName;

    public Post() {
    }

    public Post(String postId, String description, String imageName) {
        this.postId = postId;
        this.description = description;
        this.imageName = imageName;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    @Override
    public String toString() {
        return "Post{" +
                "postId='" + postId + '\'' +
                ", description='" + description + '\'' +
                ", imageName='" + imageName + '\'' +
                '}';
    }
}
