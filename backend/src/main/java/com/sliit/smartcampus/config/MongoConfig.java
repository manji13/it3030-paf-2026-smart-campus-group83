package com.sliit.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        // මේ ලින්ක් එක මගින් අපි අනිවාර්යයෙන්ම Atlas එකට සම්බන්ධ වෙනවා
        return MongoClients.create("mongodb+srv://manjikavi8_db_user:Kavishan1234@cluster0.vxsfzun.mongodb.net/smartcampus_db?appName=Cluster0");
    }
}
  