import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';
import VideoCall from './VideoCall';
import QuestionPanel from './QuestionPanel';

interface InterviewData {
  id: string;
  job_description: string;
  candidate_experience: string;
  job_title: string;
  candidate_name: string;
}

function InterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const { supabase } = useSupabase();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchInterviewData();
    }
  }, [id]);

  const fetchInterviewData = async () => {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching interview data:', error);
      return;
    }

    setInterviewData(data);
  };

  const saveNotes = async () => {
    if (!id) return;

    const { error } = await supabase
      .from('interviews')
      .update({ interviewer_notes: notes })
      .eq('id', id);

    if (error) {
      console.error('Error saving notes:', error);
    }
  };

  if (!interviewData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex">
      <div className="flex-1 flex flex-col">
        <div className="h-2/3">
          <VideoCall />
        </div>
        <div className="h-1/3 p-4 bg-white">
          <textarea
            className="w-full h-full p-2 border rounded"
            placeholder="Interview notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
          />
        </div>
      </div>
      
      <div className="w-1/3 bg-gray-50 p-4 overflow-y-auto">
        <QuestionPanel
          jobDescription={interviewData.job_description}
          candidateExperience={interviewData.candidate_experience}
        />
      </div>
    </div>
  );
}

export default InterviewRoom;