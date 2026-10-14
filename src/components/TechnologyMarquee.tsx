import {
  siCloudflare,
  siDocker,
  siGithubactions,
  siGitlab,
  siGooglecloud,
  siGrafana,
  siKubernetes,
  siOpentelemetry,
  siPrometheus,
  siTerraform,
} from "simple-icons";
import { MarqueeLogoScroller } from "@/components/ui/marquee-logo-scroller";

function iconDataUri(path: string, hex: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${hex}"><path d="${path}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function mix(hex: string, target: string, amount: number) {
  const a = parseInt(hex, 16);
  const b = parseInt(target, 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * amount);
  const g = Math.round(ag + (bg - ag) * amount);
  const bl = Math.round(ab + (bb - ab) * amount);
  return `#${[r, g, bl].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function gradientFrom(hex: string) {
  return { from: mix(hex, "ffffff", 0.55), via: `#${hex}`, to: mix(hex, "000000", 0.35) };
}

const TECHNOLOGIES = [
  { icon: siGooglecloud, name: "Google Cloud" },
  { icon: siCloudflare, name: "Cloudflare" },
  { icon: siDocker, name: "Docker" },
  { icon: siKubernetes, name: "Kubernetes" },
  { icon: siTerraform, name: "Terraform" },
  { icon: siGithubactions, name: "GitHub Actions" },
  { icon: siGitlab, name: "GitLab CI/CD" },
  { icon: siPrometheus, name: "Prometheus" },
  { icon: siGrafana, name: "Grafana" },
  { icon: siOpentelemetry, name: "OpenTelemetry", hexOverride: "425CC7" },
];

const LOGOS = TECHNOLOGIES.map(({ icon, name, hexOverride }) => {
  const hex = hexOverride ?? icon.hex;
  return {
    src: iconDataUri(icon.path, hex),
    alt: name,
    gradient: gradientFrom(hex),
  };
});

export default function TechnologyMarquee() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 xl:max-w-[1400px] 2xl:max-w-[1800px] md:px-10">
        <MarqueeLogoScroller
          title="Built around your existing stack."
          description="We don't ask you to rip out your tools and start over. Our engineers work daily across AWS, Azure, and Google Cloud, and build on the CI/CD, container, and observability tooling your team already trusts."
          logos={LOGOS}
          speed="slow"
        />
      </div>
    </section>
  );
}
