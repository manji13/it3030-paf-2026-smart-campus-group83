package com.sliit.smartcampus.service.member2;

import com.sliit.smartcampus.dto.member2.AdminReviewDTO;
import com.sliit.smartcampus.dto.member2.BookingRequestDTO;
import com.sliit.smartcampus.dto.member2.BookingResponseDTO;
import com.sliit.smartcampus.entity.member2.Booking;
import com.sliit.smartcampus.entity.member1.Facility;
import com.sliit.smartcampus.exception.ResourceNotFoundException;
import com.sliit.smartcampus.exception.ValidationException;
import com.sliit.smartcampus.repository.member2.BookingRepository;
import com.sliit.smartcampus.repository.member1.FacilityRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String userId) {
        if (requestDTO.getStartTime().isAfter(requestDTO.getEndTime()) || requestDTO.getStartTime().equals(requestDTO.getEndTime())) {
            throw new ValidationException("Start time must be before end time");
        }

        Facility facility = facilityRepository.findById(requestDTO.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + requestDTO.getResourceId()));
        
        if ("OUT_OF_SERVICE".equals(facility.getStatus())) {
            throw new ValidationException("Facility is currently out of service");
        }

        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDateAndStatusIn(
                requestDTO.getResourceId(), requestDTO.getDate(), Arrays.asList("PENDING", "APPROVED"));

        for (Booking existing : existingBookings) {
            if (isOverlapping(requestDTO.getStartTime(), requestDTO.getEndTime(), existing.getStartTime(), existing.getEndTime())) {
                throw new ValidationException("Booking time conflicts with an existing booking");
            }
        }

        Booking booking = new Booking();
        BeanUtils.copyProperties(requestDTO, booking);
        booking.setUserId(userId);
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    @Override
    public BookingResponseDTO updateBookingStatus(String id, AdminReviewDTO adminReviewDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        String newStatus = adminReviewDTO.getStatus();
        if (!Arrays.asList("APPROVED", "REJECTED").contains(newStatus)) {
            throw new ValidationException("Invalid status update. Only APPROVED or REJECTED allowed.");
        }

        booking.setStatus(newStatus);
        booking.setAdminReason(adminReviewDTO.getReason());

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToDTO(updatedBooking);
    }

    @Override
    public BookingResponseDTO cancelBooking(String id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!booking.getUserId().equals(userId)) {
            throw new ValidationException("You are not authorized to cancel this booking");
        }

        if ("APPROVED".equals(booking.getStatus()) || "PENDING".equals(booking.getStatus())) {
            booking.setStatus("CANCELLED");
            Booking updatedBooking = bookingRepository.save(booking);
            return mapToDTO(updatedBooking);
        } else {
            throw new ValidationException("Only PENDING or APPROVED bookings can be cancelled");
        }
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        BeanUtils.copyProperties(booking, dto);
        return dto;
    }
}
