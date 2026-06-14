"use client";

import { Quote, Star } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface AnimatedTestimonialsProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials?: Testimonial[];
  autoRotateInterval?: number;
  className?: string;
}

// Self-contained Avatar components to avoid missing shadcn dependencies
function Avatar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-zinc-800 ${className || ""}`}>
      {children}
    </div>
  );
}

function AvatarImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`aspect-square h-full w-full object-cover ${className || ""}`}
    />
  );
}

function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-sm font-black uppercase ${className || ""}`}>
      {children}
    </div>
  );
}

export function AnimatedTestimonials({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it. See what developers and companies have to say about our starter template.",
  badgeText = "Trusted by developers",
  testimonials = [],
  autoRotateInterval = 6000,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Auto rotate testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} id="testimonials" className={`py-20 sm:py-28 overflow-hidden bg-[#ffffff] border-t border-slate-200/50 ${className || ""}`}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center text-center md:text-left">
            <div className="space-y-5 md:space-y-6">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#9fe870]/20 text-emerald-800 dark:text-[#9fe870] uppercase tracking-wider font-mono">
                  <Star size={11} className="fill-current" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 leading-[0.95]">
                {title}
              </h2>

              <p className="max-w-[500px] mx-auto md:mx-0 text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
                {subtitle}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2.5 pt-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === index ? "w-10 bg-slate-900" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div variants={itemVariants} className="relative w-full max-w-md mx-auto min-h-[340px] sm:min-h-[320px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0 w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 80,
                  scale: activeIndex === index ? 1 : 0.93,
                  pointerEvents: activeIndex === index ? "auto" : "none",
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div className="bg-[#f5f6f4] border border-slate-200/60 rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between shadow-sm relative overflow-hidden">
                  
                  {/* Rating Stars */}
                  <div className="mb-5 flex gap-1">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                  </div>

                  {/* Content */}
                  <div className="relative flex-1">
                    <Quote className="absolute -top-3 -left-3 h-8 w-8 text-slate-300 rotate-180 opacity-40" />
                    <p className="relative z-10 text-sm sm:text-base font-semibold leading-relaxed text-slate-800 pl-4">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Divider line */}
                  <div className="my-5 h-px w-full bg-slate-200" />

                  {/* Author Meta */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm sm:text-base">
                        {testimonial.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-bold uppercase tracking-tight">
                        {testimonial.role} <span className="text-slate-300 mx-1">|</span> {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Corner accent marks */}
                  <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-slate-200" />
                  <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-slate-200" />
                </div>
              </motion.div>
            ))}

            {/* Decorative back layers */}
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl bg-slate-100 border border-slate-200/40 -z-10 translate-x-2 translate-y-2 opacity-50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
