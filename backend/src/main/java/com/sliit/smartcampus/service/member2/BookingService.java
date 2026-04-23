package com.sliit.smartcampus.service.member2;

import com.sliit.smartcampus.dto.member2.AdminReviewDTO;
import com.sliit.smartcampus.dto.member2.BookingRequestDTO;
import com.sliit.smartcampus.dto.member2.BookingResponseDTO;

import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String userId);
    BookingResponseDTO updateBookingStatus(String id, AdminReviewDTO adminReviewDTO);
    BookingResponseDTO cancelBooking(String id, String userId);
    List<BookingResponseDTO> getAllBookings();
    List<BookingResponseDTO> getUserBookings(String userId);
}
