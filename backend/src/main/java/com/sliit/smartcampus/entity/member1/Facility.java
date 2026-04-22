package com.sliit.smartcampus.entity.member1;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "facilities")
public class Facility {
    
    @Id
    private String id;
    
    private String name;
    private String type; // LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT
    private Integer capacity;
    private String location;
    private List<String> availabilityWindows;
    private String status; // ACTIVE, OUT_OF_SERVICE

    public Facility() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<String> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<String> availabilityWindows) { this.availabilityWindows = availabilityWindows; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
