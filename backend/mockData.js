// Mock data generator for testing the therapist search and booking functionality
// This file provides sample data to test the Epic 3 features

// Sample therapist profiles
const mockTherapists = [
  {
    id: "therapist_1",
    name: "Dr. Sarah Mitchell",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@therapy.com",
    phone: "(555) 123-4567",
    specialty: "Cognitive Behavioral Therapy (CBT)",
    specializations: ["Anxiety Treatment", "Depression Treatment", "CBT"],
    profilePicture:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    languages: ["English", "Spanish"],
    location: "San Francisco, CA",
    bio: "Dr. Sarah Mitchell is a licensed clinical psychologist with over 8 years of experience specializing in cognitive behavioral therapy. She has helped hundreds of clients overcome anxiety, depression, and trauma-related issues. Dr. Mitchell believes in creating a safe, supportive environment where clients can explore their thoughts and develop healthier coping strategies.",
    education: [
      {
        degree: "Ph.D. in Clinical Psychology",
        school: "Stanford University",
        year: "2015",
      },
      {
        degree: "M.A. in Psychology",
        school: "UC Berkeley",
        year: "2012",
      },
    ],
    experience: "8+ years",
    certifications: [
      "Licensed Clinical Psychologist (CA)",
      "Certified CBT Therapist",
      "Trauma-Informed Care Certification",
    ],
    rating: 4.9,
    reviewCount: 127,
    sessionPrice: 150,
    isAvailable: true,
  },
  {
    id: "therapist_2",
    name: "Dr. Michael Chen",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@therapy.com",
    phone: "(555) 234-5678",
    specialty: "Marriage Counseling",
    specializations: [
      "Marriage Counseling",
      "Family Therapy",
      "Relationship Issues",
    ],
    profilePicture:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    languages: ["English", "Mandarin"],
    location: "Los Angeles, CA",
    bio: "Dr. Michael Chen is a licensed marriage and family therapist with 12 years of experience helping couples and families build stronger relationships. He specializes in communication techniques, conflict resolution, and rebuilding trust. Dr. Chen takes a collaborative approach, working with clients to identify their strengths and develop practical solutions.",
    education: [
      {
        degree: "Ph.D. in Marriage and Family Therapy",
        school: "UCLA",
        year: "2011",
      },
    ],
    experience: "12+ years",
    certifications: [
      "Licensed Marriage and Family Therapist (CA)",
      "Gottman Method Couples Therapy",
      "Emotionally Focused Therapy (EFT)",
    ],
    rating: 4.8,
    reviewCount: 89,
    sessionPrice: 175,
    isAvailable: true,
  },
  {
    id: "therapist_3",
    name: "Dr. Emma Rodriguez",
    firstName: "Emma",
    lastName: "Rodriguez",
    email: "emma.rodriguez@therapy.com",
    phone: "(555) 345-6789",
    specialty: "PTSD Treatment",
    specializations: [
      "PTSD Treatment",
      "Trauma Therapy",
      "Military & Veteran Support",
    ],
    profilePicture:
      "https://images.unsplash.com/photo-1594824531860-1fa2c835bd90?w=400&h=400&fit=crop&crop=face",
    languages: ["English", "Spanish"],
    location: "Austin, TX",
    bio: "Dr. Emma Rodriguez is a trauma specialist with extensive experience treating PTSD, particularly in military veterans and first responders. She utilizes evidence-based treatments including EMDR, CPT, and exposure therapy. Dr. Rodriguez is passionate about helping individuals reclaim their lives after traumatic experiences.",
    education: [
      {
        degree: "Ph.D. in Clinical Psychology",
        school: "University of Texas",
        year: "2013",
      },
    ],
    experience: "10+ years",
    certifications: [
      "Licensed Clinical Psychologist (TX)",
      "EMDR Certified Therapist",
      "Cognitive Processing Therapy (CPT)",
    ],
    rating: 4.9,
    reviewCount: 156,
    sessionPrice: 160,
    isAvailable: true,
  },
  {
    id: "therapist_4",
    name: "Dr. James Wilson",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@therapy.com",
    phone: "(555) 456-7890",
    specialty: "Addiction Counseling",
    specializations: [
      "Addiction Counseling",
      "Substance Abuse",
      "Group Therapy",
    ],
    profilePicture:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    languages: ["English"],
    location: "Seattle, WA",
    bio: "Dr. James Wilson has dedicated his career to helping individuals overcome addiction and substance abuse. With 15 years of experience, he combines individual therapy with group sessions to provide comprehensive support. Dr. Wilson believes in the power of community and peer support in the recovery journey.",
    education: [
      {
        degree: "Ph.D. in Addiction Psychology",
        school: "University of Washington",
        year: "2008",
      },
    ],
    experience: "15+ years",
    certifications: [
      "Licensed Clinical Psychologist (WA)",
      "Certified Addiction Counselor (CAC)",
      "Group Therapy Certification",
    ],
    rating: 4.7,
    reviewCount: 203,
    sessionPrice: 140,
    isAvailable: true,
  },
  {
    id: "therapist_5",
    name: "Dr. Lisa Thompson",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@therapy.com",
    phone: "(555) 567-8901",
    specialty: "Child Psychology",
    specializations: [
      "Child Psychology",
      "Adolescent Therapy",
      "Family Therapy",
    ],
    profilePicture:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face",
    languages: ["English", "French"],
    location: "Boston, MA",
    bio: "Dr. Lisa Thompson specializes in child and adolescent psychology, helping young people navigate developmental challenges, behavioral issues, and family dynamics. She uses play therapy, art therapy, and family systems approaches to create engaging, effective treatment plans.",
    education: [
      {
        degree: "Ph.D. in Child Psychology",
        school: "Harvard University",
        year: "2016",
      },
    ],
    experience: "7+ years",
    certifications: [
      "Licensed Clinical Psychologist (MA)",
      "Play Therapy Certification",
      "Child Trauma Specialist",
    ],
    rating: 4.8,
    reviewCount: 94,
    sessionPrice: 130,
    isAvailable: false,
  },
  {
    id: "therapist_6",
    name: "Dr. Robert Kim",
    firstName: "Robert",
    lastName: "Kim",
    email: "robert.kim@therapy.com",
    phone: "(555) 678-9012",
    specialty: "Anxiety Treatment",
    specializations: [
      "Anxiety Treatment",
      "Panic Disorders",
      "Mindfulness-Based Therapy",
    ],
    profilePicture:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    languages: ["English", "Korean"],
    location: "New York, NY",
    bio: "Dr. Robert Kim combines traditional cognitive therapy with mindfulness-based approaches to help clients manage anxiety and panic disorders. He has extensive training in meditation and mindfulness techniques, which he integrates into his therapeutic practice to help clients develop long-term coping skills.",
    education: [
      {
        degree: "Ph.D. in Clinical Psychology",
        school: "Columbia University",
        year: "2014",
      },
    ],
    experience: "9+ years",
    certifications: [
      "Licensed Clinical Psychologist (NY)",
      "Mindfulness-Based Stress Reduction (MBSR)",
      "Acceptance and Commitment Therapy (ACT)",
    ],
    rating: 4.9,
    reviewCount: 178,
    sessionPrice: 180,
    isAvailable: true,
  },
];

// Generate sample time slots for each therapist
const generateTimeSlots = (therapistId, daysAhead = 30) => {
  const slots = [];
  const now = new Date();

  for (let day = 1; day <= daysAhead; day++) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);

    // Skip weekends for some therapists
    if (
      therapistId === "therapist_2" &&
      (date.getDay() === 0 || date.getDay() === 6)
    ) {
      continue;
    }

    // Generate 3-6 slots per day
    const slotsPerDay = Math.floor(Math.random() * 4) + 3;
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let i = 0; i < slotsPerDay; i++) {
      const hour = startHour + i * 2; // 2-hour intervals
      if (hour >= endHour) break;

      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0); // 1-hour sessions

      slots.push({
        id: `slot_${therapistId}_${day}_${i}`,
        therapistId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        date: date.toDateString(),
        duration: 60,
        price:
          mockTherapists.find((t) => t.id === therapistId)?.sessionPrice || 150,
        isAvailable: Math.random() > 0.3, // 70% availability
      });
    }
  }

  return slots;
};

// Generate all slots
const mockSlots = [];
mockTherapists.forEach((therapist) => {
  mockSlots.push(...generateTimeSlots(therapist.id));
});

module.exports = {
  mockTherapists,
  mockSlots,
};
