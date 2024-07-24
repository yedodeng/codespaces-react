import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Calendar from "../../components/calendar";

export default function FullCalendar() {

    return (<div>
        <Calendar />
    </div>)
  }


