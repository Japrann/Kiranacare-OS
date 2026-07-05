"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import Greeting from "@/components/Greeting";
import CareCard from "@/components/CareCard";
import ChecklistCard from "@/components/ChecklistCard";
import SecretMessage from "@/components/SecretMessage";
import CatCorner from "@/components/CatCorner";
import NotificationModal from "@/components/NotificationModal";
import { getGreeting, getSecretMessage } from "@/lib/messages";
import {
  initOneSignal,
  requestPushPermission,
  getSubscriptionStatus,
} from "@/lib/onesignal";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle"); // idle | success | declined
  const [greeting, setGreeting] = useState(null);
  const [secretMessage, setSecretMessage] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setSecretMessage(getSecretMessage());

    // Initialize OneSignal as soon as the app loads. This only loads the SDK
    // and registers the app — it never triggers the permission prompt.
    initOneSignal();
  }, []);

  useEffect(() => {
    if (!booted) return;
    // Don't re-prompt someone who already made a choice on a previous visit.
    const priorStatus = getSubscriptionStatus();
    if (priorStatus === "subscribed" || priorStatus === "denied") return;

    const t = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(t);
  }, [booted]);

  async function handleAllow() {
    const { granted } = await requestPushPermission();
    setModalStatus(granted ? "success" : "declined");

    setTimeout(() => {
      setShowModal(false);
      setModalStatus("idle");
    }, 2600);
  }

  function handleDismiss() {
    setShowModal(false);
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <AnimatePresence>
        {!booted && <BootScreen onFinish={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && greeting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-5 pb-14 pt-8 sm:pt-12"
        >
          <Greeting
            title={greeting.title}
            emoji={greeting.emoji}
            subtitle={greeting.subtitle}
          />
          <CareCard />
          <ChecklistCard />
          <SecretMessage message={secretMessage} />
          <CatCorner />

          <p className="mt-2 text-center text-[11px] text-ink-soft/70">
            made quietly, with care · Kirana Care OS
          </p>
        </motion.div>
      )}

      <NotificationModal
        visible={showModal}
        status={modalStatus}
        onAllow={handleAllow}
        onDismiss={handleDismiss}
      />
    </main>
  );
}
