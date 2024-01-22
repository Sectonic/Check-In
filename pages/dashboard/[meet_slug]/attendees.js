import { SsrRoute } from "@/lib/config";
import { useRef, useState } from "react";
import db from "@/lib/prisma";
import { useRouter } from "next/router";

export const getServerSideProps = SsrRoute(
    async function getServerSideProps({ req, params }) {

        const user = req.session.user;
        const meet = await db.meet.findUnique({ where: { id: Number(params.meet_slug) }, select: { inclusive: true } });

        if (meet.inclusive) {
          return { props: { meet: params.meet_slug, inclusive: true } };
        }

        const attendeesInside = await db.attendee.findMany({
          where: {
              meets: {
                some: {
                  id: Number(params.meet_slug)
                }
              },
              organizer: {
                  id: user.id
              }
          }
        });
        const attendeesOutside = await db.attendee.findMany({
          where: {
              meets: {
                every: {
                  id: { not: Number(params.meet_slug)}
                }
              },
              organizer: {
                  id: user.id
              }
          }
        });
        return {
            props: { 
              attendees: { 
                inside: attendeesInside, 
                outside: attendeesOutside
              },
              meet: params.meet_slug,
              inclusive: false
            }
        }
    }
)

export default function Attendees({ attendees, meet, inclusive }) {
  const router = useRouter();
  const [newInside, setNewInside] = useState([]);
  const [newOutside, setNewOutside] = useState([]);
  const [search, setSearch] = useState('');
  const save = useRef(null)

  if (inclusive) {
    return (
      <div className="max-sm:px-6 w-full sm:w-3/4 mx-auto">
        <div className="text-3xl font-semibold">Meet Attendees</div>
        <div>This meet has enabled include all attendees. This means it selects every attendee you have created as an organizer. To turn this off, go to meet settings.</div>
      </div>
    )
  }

  const addInside = (attendee) => {
    if (!attendees.inside.some(e => e.specificId === attendee.specificId)) {
      setNewInside(prev => [...prev, attendee]);
    }
    setNewOutside(prev => prev.filter(e => e.specificId !== attendee.specificId));
  }

  const addOutside = (attendee) => {
    if (!attendees.outside.some(e => e.specificId === attendee.specificId)) {
      setNewOutside(prev => [...prev, attendee]);
    }
    setNewInside(prev => prev.filter(e => e.specificId !== attendee.specificId));
  }

  const addAll = () => {
    setNewInside([...attendees.outside]);
    setNewOutside([]);
  }

  const removeAll = () => {
    setNewOutside([...attendees.inside]);
    setNewInside([]);
  }

  const updateMeet = async () => {

    save.current.className = 'btn btn-success btn-sm loading';

    const data = {
      inside: newInside.map(e => ({id: e.id, name: e.name, specificId: e.specificId})),
      outside: newOutside.map(e => e.id),
      meet: meet
    }

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }

    const response = await fetch('/api/update/meet/attendees', options);
    if (response.ok) {
      save.current.className = 'btn btn-success btn-sm';
      setNewInside([]);
      setNewOutside([]);
      router.replace(router.asPath);
    }
    
  }

  if (meet.inclusive) {

  }

  return (
    <div className="max-sm:px-6 w-full sm:w-3/4 mx-auto">
      <div className="mt-6 flex justify-start gap-4">
        <div className="btn btn-primary btn-sm" onClick={addAll}>Add All</div>
        <div className="btn btn-warning btn-sm" onClick={removeAll}>Remove All</div>
        <div className="btn btn-success btn-sm" onClick={updateMeet} ref={save}>Save</div>
      </div>
      <div className="text-sm mt-2">Click on an attendee to move them from one side to the other.</div>
      <div className="mx-auto w-full form-control mt-4">
        <input name="search" type="text" placeholder="Search By Name/ID" className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex justify-center gap-4 mt-3">
        <div className="basis-1/2">
          <div className="text-xl sm:text-3xl font-semibold mb-2">Inside Meet</div>
          <hr/>
          <div className="glass !bg-primary mt-2 p-2 flex flex-col gap-2 rounded-xl">
            {attendees.inside && attendees.inside.map((attendee, i) => {
              if (!newOutside.some(e => e.specificId === attendee.specificId) && (attendee.name.includes(search) || attendee.specificId.includes(search))) {
                return (
                  <div key={i} className="p-3 bg-white hover:bg-white/50 transition-all rounded-lg w-full cursor-pointer" onClick={() => addOutside(attendee)}>
                    {attendee.name} <span className="text-xs font-thin">- {attendee.specificId}</span>
                  </div>
                )
              }
            })}
            {newInside.map((attendee, i) => {
              if (attendee.name.includes(search) || attendee.specificId.includes(search)) {
                return (
                  <div key={i + attendees.inside.length} className="p-3 bg-white hover:bg-white/50 transition-all rounded-lg w-full cursor-pointer" onClick={() => addOutside(attendee)}>
                    {attendee.name} <span className="text-xs font-thin">- {attendee.specificId}</span>
                  </div>
                )
              }
            })}
          </div>
        </div>
        <div className="basis-1/2">
          <div className="text-xl sm:text-3xl font-semibold text-right mb-2">Outside Meet</div>
          <hr/>
          <div className="mt-2 p-2 flex flex-col gap-2 bg-primary-content rounded-xl">
            {attendees.outside && attendees.outside.map((attendee, i) => {
              if (!newInside.some(e => e.specificId === attendee.specificId) && (attendee.name.includes(search) || attendee.specificId.includes(search))) {
                return (
                  <div key={i} className="p-3 bg-white hover:bg-primary/30 transition-all rounded-lg w-full cursor-pointer" onClick={() => addInside(attendee)}>
                    {attendee.name} <span className="text-xs font-thin">- {attendee.specificId}</span>
                  </div>
                )
              }
            })}
            {newOutside.map((attendee, i) => {
              if (attendee.name.includes(search) || attendee.specificId.includes(search)) {
                return (
                  <div key={i + attendees.outside.length} className="p-3 bg-white hover:bg-primary/30 transition-all rounded-lg w-full cursor-pointer" onClick={() => addInside(attendee)}>
                    {attendee.name} <span className="text-xs font-thin">- {attendee.specificId}</span>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}