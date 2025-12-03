import { useEffect, useRef } from "react";

export function GraphicalBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Resize canvas dynamically
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Particles (glowing sparks)
		interface Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;
			alpha: number;
			pulse: number;
		}

		const particles: Particle[] = [];
		const particleCount = 60;
		const colors = ["#efae0e", "#fffefe", "#d9b92e"]; // gold & white tones

		for (let i = 0; i < particleCount; i++) {
			const color = colors[Math.floor(Math.random() * colors.length)];
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 3 + 1.2,
				speedX: (Math.random() - 0.5) * 0.3,
				speedY: (Math.random() - 0.5) * 0.3,
				color,
				alpha: Math.random() * 0.6 + 0.3,
				pulse: Math.random() * Math.PI * 2,
			});
		}

		// Floating Logo Items
		interface FloatingItem {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			rotation: number;
			rotationSpeed: number;
			layer: number;
			opacity: number;
		}

		const logoImage = new Image();
		logoImage.src =
			"https://missionuncrossable-game.net/wp-content/uploads/2025/05/mission-uncrossable-logo.png.webp";

		const logos: FloatingItem[] = [];
		const logoCount = 20;

		for (let i = 0; i < logoCount; i++) {
			const layer = Math.floor(Math.random() * 3);
			const baseSize = [60, 100, 140][layer];
			logos.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: baseSize + Math.random() * 40,
				speedX: (Math.random() - 0.5) * (0.25 + layer * 0.1),
				speedY: (Math.random() - 0.5) * (0.25 + layer * 0.1),
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.005,
				layer,
				opacity: 0.25 + layer * 0.35,
			});
		}

		let time = 0;
		let animationFrameId: number;

		const render = () => {
			time += 0.02;

			// Dark purple-blue background gradient
			const gradient = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				canvas.width
			);
			gradient.addColorStop(0, "#181839");
			gradient.addColorStop(1, "#0f0f23");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Golden light streaks
			for (let i = 0; i < 3; i++) {
				ctx.strokeStyle = `rgba(239,174,14,${0.03 + 0.02 * i})`;
				ctx.lineWidth = 1.2 + i * 0.6;
				ctx.beginPath();
				ctx.moveTo((time * 25 + i * 400) % canvas.width, 0);
				ctx.lineTo((time * 25 + i * 400 + 300) % canvas.width, canvas.height);
				ctx.stroke();
			}

			// Glowing particles
			particles.forEach((p) => {
				p.pulse += 0.05;
				const glow = Math.sin(p.pulse) * 0.5 + 0.5;
				p.x += p.speedX;
				p.y += p.speedY;

				if (p.x > canvas.width) p.x = 0;
				if (p.x < 0) p.x = canvas.width;
				if (p.y > canvas.height) p.y = 0;
				if (p.y < 0) p.y = canvas.height;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size + glow, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.shadowBlur = 12 * glow;
				ctx.shadowColor = p.color;
				ctx.fill();
			});

			// Floating Logos
			logos.forEach((logo, idx) => {
				logo.x += logo.speedX + Math.sin(time + idx) * 0.2 * (logo.layer + 1);
				logo.y += logo.speedY + Math.cos(time + idx) * 0.2 * (logo.layer + 1);
				logo.rotation += logo.rotationSpeed;

				if (logo.x > canvas.width) logo.x = -logo.size;
				if (logo.x < -logo.size) logo.x = canvas.width;
				if (logo.y > canvas.height) logo.y = -logo.size;
				if (logo.y < -logo.size) logo.y = canvas.height;

				ctx.save();
				ctx.globalAlpha = logo.opacity;
				ctx.shadowColor = "#efae0e";
				ctx.shadowBlur = 15;
				ctx.translate(logo.x + logo.size / 2, logo.y + logo.size / 2);
				ctx.rotate(logo.rotation);
				ctx.drawImage(
					logoImage,
					-logo.size / 2,
					-logo.size / 2,
					logo.size,
					logo.size
				);
				ctx.restore();
			});

			// Soft vignette effect
			const vignette = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				canvas.width / 4,
				canvas.width / 2,
				canvas.height / 2,
				canvas.width / 1.2
			);
			vignette.addColorStop(0, "rgba(0,0,0,0)");
			vignette.addColorStop(1, "rgba(0,0,0,0.65)");
			ctx.fillStyle = vignette;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			animationFrameId = requestAnimationFrame(render);
		};

		logoImage.onload = () => render();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className='fixed top-0 left-0 w-full h-full pointer-events-none -z-10'
		/>
	);
}

export default GraphicalBackground;
