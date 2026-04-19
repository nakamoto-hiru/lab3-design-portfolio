import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-24">
      <Container>
        <div className="flex items-center justify-between border-t border-border py-8">
          <p className="text-[0.75rem] tracking-wide text-text-tertiary">
            &copy; {new Date().getFullYear()}
          </p>
          <p className="text-[0.75rem] tracking-wide text-text-tertiary">
            Designed by Slug Macro
          </p>
        </div>
      </Container>
    </footer>
  )
}
