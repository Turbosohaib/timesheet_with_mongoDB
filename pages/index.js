import Table from "../components/Table"
import clientPromise from "../util/mongodb"
import { EJSON } from "bson";

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("Projects_timesheet");

  const projects = EJSON.serialize(await db
    .collection("project")
    .find({})
    .toArray());

  //const projects = [];

  console.log(projects)

  return {
    props: {
      projects
    }
  }
}

export default function Home({ projects }) {
  return (
    <>
      <div className="bg-gray-800 text-white">
        <header className="py-5">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">TimeSheet</h1>
            <p className="text-lg font-medium">Weekly hours</p>
          </div>
        </header>
      </div>
      <Table projectsData={projects} />
    </>
  )
}
