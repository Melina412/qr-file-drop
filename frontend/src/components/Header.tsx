function Header() {
  return (
    <>
      <header className='flex flex-row justify-between items-center gap-4 p-3 m-auto'>
        <h1 className='text-xl text-center'>
          Welcome to <span className='text-accent'>QRFileDrop</span>, a secure platform to share confidential files.
        </h1>
      </header>
    </>
  );
}

export default Header;
