package com.sliit.smartcampus.entity.member2;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;
    
    private String userId; // The user making the booking
    private String resourceId; // The ID of the facility/resource
    
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    
    private String purpose;
    private Integer expectedAttendees;
    
    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String adminReason; // Reason for rejection or approval notes

    public Booking() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    
    public Integer getExpectedAttendees() { return expectedAttendees; }
    public void setExpectedAttendees(Integer expectedAttendees) { this.expectedAttendees = expectedAttendees; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAdminReason() { return adminReason; }
    public void setAdminReason(String adminReason) { this.adminReason = adminReason; }
}
