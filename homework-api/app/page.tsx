import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <Image
          src="/epszalogo.avif"
          alt="Business Logo"
          width={150}
          height={150}
          className="mx-auto"
          priority
        />
        <h1 className="home-title">Homework Submission Platform</h1>
        <p className="home-subtitle">Submit and manage assignments securely.</p>
        <div className="home-buttons">
          <Link href="/student" className="btn-student">
            Student Dashboard
          </Link>
          <Link href="/teacher" className="btn-teacher">
            Teacher Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}