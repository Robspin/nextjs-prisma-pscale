import { useRef, useEffect } from 'react'
import type { NextPage } from 'next'
import { format } from 'date-fns';
import Container from '../components/Container'


const Home: NextPage = (props: any) => {
  const messageEl = useRef<HTMLInputElement>(null);
  const nameEl = useRef<HTMLInputElement>(null);

  const { guestbookEntriesData, viewsData } = props

  useEffect(() => { visited() }, [])

  const visited = async () => {
    const res = await fetch('/api/views/home', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
  }

  const signGuestbook = async (e: any) => {
    e.preventDefault();
    if (!messageEl.current || !nameEl.current) return

    const res = await fetch('/api/guestbook', {
      body: JSON.stringify({
        body: { message: messageEl.current.value, name: nameEl.current.value }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    const { error } = await res.json();
    console.error(error)

    guestbookEntriesData.push({ 
      id: guestbookEntriesData.length + 1,
      updatedAt: Date.now(),
      body: messageEl.current.value,
      createdBy: nameEl.current.value
    })

    messageEl.current.value = '';
    nameEl.current.value = '';
  };


  return (
    <Container>
      <div className="flex relative flex-col justify-center items-start max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pb-16">
        <h1 className="pt-20 font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
          GreenTemple
        </h1>
        <h2 className="text-gray-700 dark:text-gray-200 mb-4">Unenumerated blog and coding website</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 min-w-32 md:mt-0 absolute right-0 top-20">{viewsData.total}x visited</p>
        <p className="text-gray-600 dark:text-gray-400 mb-16">
          This website is currently still being built. The stack I am using is a NextJS frontend with TailwindCSS, a mysql database in Planetscale along with Prisma ORM. Updates coming soon!
        </p>
        <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-black dark:text-white">
          Guestbook
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
        Leave a comment below. It could be anything – appreciation, information, wisdom, or even humor. Surprise me!
        </p>
        <div className="border border-blue-200 rounded p-6 my-4 w-full dark:border-gray-800 bg-blue-50 dark:bg-blue-opaque">
          <h5 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Sign the guestbook</h5>
          <p className="my-1 text-gray-800 dark:text-gray-200">
          Share a message for a future visitor of my site.
          </p>
          <form className="relative my-4" onSubmit={signGuestbook}>
            <input aria-label="Your message" placeholder="Your message..." ref={messageEl} required 
            className="pl-4 pr-32 py-2 mt-1 block focus:outline-none w-full border-gray-300 
              rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              <input aria-label="Your name" placeholder="Name" ref={nameEl} required 
            className="pl-4 pr-32 py-2 mt-1 block w-full  focus:outline-none border-gray-300 
              rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                 <button
              className="flex items-center justify-center absolute right-1 top-12 px-4 pt-1 font-medium h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded w-28"
              type="submit"
            >Sign</button>
          </form>
        </div>
        {guestbookEntriesData.map((entry: any) => (<GuestbookEntry key={entry.id} entry={entry} />))}
      </div>
    </Container>
  )
}

function GuestbookEntry({ entry }: any) {
  const deleteEntry = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/guestbook/${entry.id}`, {
      method: 'DELETE'
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="dark:text-white w-full">{entry.body}</div>
      <div className="flex items-center space-x-3">
        <p className="text-sm text-gray-500">{entry.created_by}</p>
        <span className=" text-gray-200 dark:text-gray-800">/</span>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          {format(new Date(entry.updated_at), "d MMM yyyy 'at' h:mm bb")}
        </p>
            <span className="text-gray-200 dark:text-gray-800">/</span>
            <button
              className="text-sm text-red-600 dark:text-red-400"
              onClick={deleteEntry}
            >
              Delete
            </button>
      </div>
    </div>
  );
}

export default Home

export async function getStaticProps() {
  const url = 'http://localhost:3000'

  const guestbookEntriesRes = await fetch(`${url}/api/guestbook`)
  const guestbookEntriesData = await guestbookEntriesRes.json()
  const viewsRes = await fetch(`${url}/api/views/home`)
  const viewsData = await viewsRes.json()


  if (!guestbookEntriesData || !viewsData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { guestbookEntriesData, viewsData },
  }
}