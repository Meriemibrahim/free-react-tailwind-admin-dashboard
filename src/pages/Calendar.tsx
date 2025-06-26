import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { interviewService } from "../services/interviewService";
import { jobService } from "../services/JobService";
import { Job } from "../../types/Job";
import { Cv } from "../../types/Cv";
import DatePicker from "../components/form/date-picker";

interface CalendarEvent extends EventInput {
  extendedProps: {
    eventType: "interview" | "jobOffer";
    calendar: string;
    jobId: number;
    jobTitle: string;
    cvId?: number;
    candidateEmail?: string;
  };
}



const calendarsEvents = {
  Danger: "Canceled",
  Success: "Completer",
  Primary: "Pending",
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [jobOffers, setJobOffers] = useState<Job[]>([]);
  const [candidatesForJob, setCandidatesForJob] = useState<Cv[]>([]);

  const [selectedJobIdFilter, setSelectedJobIdFilter] = useState<number | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Modal fields for adding/editing interview
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");

  const [selectedJobForInterview, setSelectedJobForInterview] = useState<number | "">("");
  const [selectedCandidate, setSelectedCandidate] = useState<number | "">("");

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // تحميل بيانات عروض العمل و المقابلات
  useEffect(() => {
    // جلب عروض العمل
    jobService.getAll()
      .then(data => {
        setJobOffers(data);
      })
      .catch(console.error);

    // جلب المقابلات
    Promise.all([interviewService.getAllInterviews()])
      .then(([interviewsData]) => {
        const interviewEvents: CalendarEvent[] = interviewsData.map((interview) => ({
          id: `interview-${interview.id}`,
          title: ` (${interview.jobTitle})`,
          start: interview.start,
          end: interview.end,
          extendedProps: {
            eventType: "interview",
            calendar: interview.calendar || "Success",
            jobId: interview.jobId,
            jobTitle: interview.jobTitle,
            cvId: interview.cvId,
            candidateEmail: interview.candidateEmail,
          },
        }));
        setEvents(interviewEvents); 
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (jobOffers.length === 0) return;

 const jobOfferEvents: CalendarEvent[] = jobOffers.map((job) => ({
  id: `jobOffer-${job.id}`,
  title: `Job Offer: ${job.title}`,
  start: job.datePublication || "", // 
  end: job.dateExpiration || "",
  extendedProps: {
    eventType: "jobOffer",
    calendar: "Primary",
    jobId: job.id ?? 0,        
    jobTitle: job.title,
  },
}));


    setEvents((prevEvents) => {
      const existingJobOfferIds = new Set(prevEvents.filter(e => e.extendedProps.eventType === "jobOffer").map(e => e.id));
      const newJobOffersToAdd = jobOfferEvents.filter(e => !existingJobOfferIds.has(e.id));
      return [...prevEvents, ...newJobOffersToAdd];
    });
  }, [jobOffers]);

  useEffect(() => {
    if (selectedJobForInterview) {
      interviewService.getCandidatesByJob(selectedJobForInterview)
        .catch(console.error);
    } else {
      setCandidatesForJob([]);
      setSelectedCandidate("");
    }
  }, [selectedJobForInterview]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event as unknown as CalendarEvent;
    setSelectedEvent(event);
    setEventTitle(event.title || "");
  setEventStartDate(event.start?.toString() || "");
setEventEndDate(event.end?.toString() || "");

    setEventLevel(event.extendedProps.calendar);
    if (event.extendedProps.eventType === "interview") {
      setSelectedJobForInterview(event.extendedProps.jobId);
      setSelectedCandidate(event.extendedProps.cvId || "");
    } else {
      setSelectedJobForInterview("");
      setSelectedCandidate("");
    }
    openModal();
  };
const handleAddOrUpdateEvent = () => {
  const now = new Date();
  const selectedStart = new Date(eventStartDate);

  if (selectedStart < now) {
    alert("⚠️ La date sélectionnée doit être supérieure à la date d'aujourd'hui.");
    return;
  }

  if (selectedEvent && selectedEvent.extendedProps.eventType === "interview") {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              start: eventStartDate,
              extendedProps: {
                ...event.extendedProps,
                calendar: eventLevel,
              },
            }
          : event
      )
    );
    closeModal();
    resetModalFields();
  } else {
    const newInterviewPayload = {
      candidateId: selectedCandidate,
      jobId: selectedJobForInterview,
      start: eventStartDate,
      end: eventEndDate,
      calendar: eventLevel,
      title: eventTitle,
    };

    interviewService.createInterview(newInterviewPayload)
      .then((createdInterview) => {
        setEvents((prev) => [
          ...prev,
          {
            id: `interview-${createdInterview.id}`,
            title: `Interview: (${createdInterview.jobTitle})`,
            start: createdInterview.start,
            end: createdInterview.end,
            extendedProps: {
              eventType: "interview",
              calendar: createdInterview.calendar || "Success",
              jobId: createdInterview.jobId,
              jobTitle: createdInterview.jobTitle,
              cvId: createdInterview.cvId,
              candidateEmail: createdInterview.candidateEmail,
            },
          },
        ]);
        closeModal();
        resetModalFields();
      })
      .catch((error) => alert("Failed to save interview: " + error.message));
  }
};


  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
    setSelectedJobForInterview("");
    setCandidatesForJob([]);
    setSelectedCandidate("");
  };

  return (
    <>
      <PageMeta title="Interview Calendar" description="View and manage interviews and job offers" />

    

      <div className="rounded-2xl border bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="rounded-2xl border bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
  <div className="flex items-center justify-between mb-4">

    {/* 🔽 Job Offer Filter */}
    <select
      id="jobFilter"
      value={selectedJobIdFilter ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        setSelectedJobIdFilter(val ? Number(val) : null);
      }}
      className="border px-3 py-2 rounded"
    >
      <option value="">All Job Offers</option>
      {jobOffers.map((job) => (
        <option key={job.id} value={job.id}>
          {job.title}
        </option>
      ))}
    </select>
  </div>

  <div className="custom-calendar">
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={events.filter((event) => {
        if (selectedJobIdFilter === null) return true;
        if (event.extendedProps.eventType === "jobOffer") return true;
        return event.extendedProps.jobId === selectedJobIdFilter;
      })}
      selectable={true}
      select={handleDateSelect}
      eventClick={handleEventClick}
      eventContent={renderEventContent}
    />
  </div>
</div>

      </div>

<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10 overflow-visible">
  <div className="flex flex-col px-2 custom-scrollbar z-[9999]">
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {selectedEvent ? "Edit Interview" : "Add Interview"}
          </h5>

    <input
  type="text"
  value={eventTitle}
  readOnly
  placeholder="Interview Title"
  className="my-2 w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
/>
      <label className="mt-2">Start Date & Time:</label>
<DatePicker
  id="start-date"
  mode="single"
  defaultDate={eventStartDate ? new Date(eventStartDate) : undefined}
  onChange={(selectedDates) => {
    if (selectedDates.length) {
      const selectedDate = selectedDates[0];
      const now = new Date();

      if (selectedDate < now) {
        alert("⚠️ La date sélectionnée doit être dans le futur.");
        return;
      }

      setEventStartDate(selectedDate.toISOString());
    } else {
      setEventStartDate("");
    }
  }}
  placeholder="Select start date and time"
/>




          <button
            onClick={handleAddOrUpdateEvent}
            className="mt-4 bg-brand-500 text-white px-4 py-2 rounded hover:bg-brand-600"
          >
            {selectedEvent ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
