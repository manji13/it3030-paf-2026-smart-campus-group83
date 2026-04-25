package com.smartcampushub.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import java.util.concurrent.TimeUnit;

/**
 * Explicit MongoDB configuration to ensure the Atlas URI is always used.
 * Spring Boot auto-config was silently falling back to localhost:27017.
 */
@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToSocketSettings(builder ->
                        builder.connectTimeout(10, TimeUnit.SECONDS)
                               .readTimeout(15, TimeUnit.SECONDS))
                .applyToServerSettings(builder ->
                        builder.heartbeatFrequency(30, TimeUnit.SECONDS))
                .build();
        return MongoClients.create(settings);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        // Extract database name from the URI (after the last '/' before '?')
        String uri = mongoUri;
        String dbName = "smartcampus_db";
        try {
            String path = uri.split("\\?")[0];
            String[] parts = path.split("/");
            if (parts.length > 0 && !parts[parts.length - 1].isEmpty()) {
                dbName = parts[parts.length - 1];
            }
        } catch (Exception ignored) {}
        return new SimpleMongoClientDatabaseFactory(mongoClient, dbName);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory factory) {
        return new MongoTemplate(factory);
    }
}
